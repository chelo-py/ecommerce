import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth, mailgun, payOrderEmailTemplate } from '../util.js';
import express from 'express';
import pool from '../conexion.js';
import sql from 'sql';
import pgPromise from 'pg-promise';

const pgp = pgPromise({});

const orderRouter = express.Router();

// Listar todos los pedidos
orderRouter.get(
    '/',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const response = await pool.query(`SELECT COUNT(*) FROM vt_pedido_cab`);
        const count = parseInt(response.rows[0].count);
        try {
            const response2 = await pool.query(
                `SELECT * FROM vt_pedido_cab ORDER BY nro_pedido LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize} `);
            const pedidos = response2.rows;
            res.send({ pedidos, page, pages: Math.ceil(count / pageSize) });
        } catch (err) {
            console.error(err.message);
        }
    })
);

// Listar pedidos por clientes
orderRouter.get(
    '/orderhistory',
    expressAsyncHandler(async (req, res) => {
        const usuario = req.query.usuario || '';
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const response = await pool.query(`SELECT COUNT(*) FROM vt_pedido_cab WHERE cod_usuario = $1`,[usuario]);
        const count = parseInt(response.rows[0].count);
        try {
            const response2 = await pool.query(
                `SELECT * FROM vt_pedido_cab WHERE cod_usuario = $1 ORDER BY nro_pedido LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize} `, [usuario]);
            const pedidos = response2.rows;
            res.send({ pedidos, page, pages: Math.ceil(count / pageSize) });
        } catch (err) {
            console.error(err.message);
        }
    })
);

//Api para crear pedidos
orderRouter.post(
    '/',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const { id } = req.user;
        const { nombreCompleto, direccion, ciudad, barrio } = req.body.shippingAddress;
        const { metodoPago, precioProductos, precioEnvio, iva, precioTotal } = req.body;

        // Insert de cabecera
        if (req.body.orderItems.length === 0) {
            res.status(400).send({ message: 'Carrito vacío' });
        } else {
            const response = await pool.query(
                `INSERT INTO vt_pedido_cab(
                    cod_usuario, pagado, entregado, nombre_completo, direccion, barrio, ciudad, metodo_pago, 
                    precio_productos, precio_envio, precio_iva, precio_total, fecha_pedido)
                    VALUES ($1, false, false, $2, $3, $4, $5, $6, $7, $8, $9, $10, current_timestamp) RETURNING nro_pedido`
                , [id, nombreCompleto, direccion, barrio, ciudad, metodoPago, precioProductos, precioEnvio, iva, precioTotal]
            );
            const { nro_pedido } = response.rows[0];
            res.status(201).send({ message: 'Nuevo pedido creado', order: response.rows[0] });

            // Insert de detalle
            var value = new Array;
            for (var i = 0; i < req.body.orderItems.length; i++) {
                var item = req.body.orderItems[i];
                value.push({
                    'nro_pedido': nro_pedido,
                    'cod_articulo': item.producto,
                    'cantidad': item.cantidad,
                    'precio': item.precio
                });
            }
            let detalle = sql.define({
                name: 'vt_pedido_det',
                columns: [
                    'cod_pedido_det',
                    'nro_pedido',
                    'cod_articulo',
                    'cantidad',
                    'precio'
                ]
            });
            let query = detalle.insert(value).returning(detalle.cod_pedido_det).toQuery();
            let { rows } = await pool.query(query);
            res.status(201).send({ message: 'detalle creado', detalle: rows });
        }
    })
);


//Api para listar los detalles de un pedido
orderRouter.get(
    '/:id/listar',
    expressAsyncHandler(async (req, res) => {
        const orderId = req.params.id;
        try {
            const detalles = await pool.query(`
            SELECT d.cod_articulo AS codarticulo, imagen, nombre, cantidad, d.precio 
            FROM vt_pedido_det AS d
            JOIN vt_articulo AS a ON d.cod_articulo = a.cod_articulo
            WHERE nro_pedido = $1`, [orderId]);
            res.send(detalles.rows);
        } catch (err) {
            console.error(err.message);
        }
    })
);

//Api para realizar el pago
orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orderId = req.params.id;
        const response = await pool.query(`SELECT nro_pedido, nombre_completo, email, fecha_pago, precio_productos,precio_iva, precio_envio, 
                                            precio_total, metodo_pago, nombre_completo, direccion, barrio, ciudad 
                                            FROM vt_pedido_cab AS c
                                            JOIN bs_usuario AS u ON c.cod_usuario = u.cod_usuario
                                            WHERE nro_pedido =$1
                                            `, [orderId]);
        const order = response.rows[0];
        const { id, status, update_time, email_address } = req.body;

        if (order) {
            const response2 = await pool.query(`UPDATE vt_pedido_cab
            SET pagado = TRUE, fecha_pago = current_timestamp
            WHERE nro_pedido = $1`, [orderId]);
            const pedidoActualizado = response2.rows[0];
            res.send({ message: 'Pedido creado', order: pedidoActualizado });

            const response3 = await pool.query(`INSERT INTO vt_pagoresultado(
                cod_pago, nro_pedido, estado, fecha_actualizacion, email)
                VALUES ($1, $2, $3, $4, $5)`, [id, orderId, status, update_time, email_address]);
            const pago = response3.rows[0];
            res.send(pago);

            //Actualizar stock
            const response4 = await pool.query(`SELECT stock, cantidad, (stock - cantidad) AS resultado, a.cod_articulo AS articulo
            FROM vt_pedido_det AS d
            JOIN vt_articulo AS a ON d.cod_articulo = a.cod_articulo
            WHERE nro_pedido = $1`, [orderId]);

            const cn = 'postgres://postgres:123@localhost:5432/ecommerce';
            const db = pgp(cn);

            var values = new Array;

            for (var i = 0; i < response4.rows.length; i++) {
                var item = response4.rows[i];
                values.push({
                    'cod_articulo': item.articulo,
                    'stock': item.resultado
                });
            }
            const cs = new pgp.helpers.ColumnSet(['?cod_articulo', 'stock'], { table: 'vt_articulo' });
            const update = pgp.helpers.update(values, cs) + ' WHERE v.cod_articulo = t.cod_articulo';
            await db.none(update);

            const response5 = await pool.query(`SELECT d.cod_articulo, nombre, cantidad, d.precio AS precio_articulo
                                                FROM vt_pedido_det AS d
                                                JOIN vt_articulo AS a ON d.cod_articulo = a.cod_articulo
                                                WHERE nro_pedido = $1`, [orderId]);
            const detalle = response5.rows;

            const response6 = await pool.query(`SELECT nro_pedido, nombre_completo, email, fecha_pago, precio_productos,precio_iva, precio_envio, 
                                            precio_total, metodo_pago, nombre_completo, direccion, barrio, ciudad 
                                            FROM vt_pedido_cab AS c
                                            JOIN bs_usuario AS u ON c.cod_usuario = u.cod_usuario
                                            WHERE nro_pedido =$1
                                            `, [orderId]);
            const pedido = response6.rows[0];

            //Mailgun para enviar al correo del cliente los detalles de su pedido
            mailgun()
                .messages()
                .send(
                    {
                        from: 'Apolo Import <apoloImport@mg.yourdomain.com>',
                        to: `${pedido.nombre_completo} <${pedido.email}>`,
                        subject: `Nuevo Pedido ${pedido.nro_pedido}`,
                        html: payOrderEmailTemplate(pedido, detalle),
                    },
                );
        } else {
            res.status(404).send({ message: 'Pedido no encontrado' });
        }
    })
);

//API para eliminar pedidos
orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const {id} = req.params;
        const response = await pool.query(`DELETE FROM vt_pedido_det WHERE nro_pedido = $1`,[id]);
        const response2 = await pool.query(`DELETE FROM vt_pagoresultado WHERE nro_pedido = $1`,[id]);
        const response3 = await pool.query(`DELETE FROM vt_pedido_cab WHERE nro_pedido = $1`,[id]);
        const order = response.rows[0];
        const order2 = response2.rows[0];
        const order3 = response3.rows[0];
        if (response) {
            res.send({ message: 'Pedido eliminado', order , order2 , order3 });
        } else {
            res.status(404).send({ message: 'Pedido no encontrado ' });
        }
    })
);

//API para confirmar el delivery de un pedido
orderRouter.put(
    '/:id/deliver',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orderId = req.params.id;
        const response = await pool.query(`SELECT * FROM vt_pedido_cab WHERE nro_pedido = $1`, [orderId]);
        const order = response.rows;

        if (order) {
            const response2 = await pool.query(`UPDATE vt_pedido_cab
            SET entregado= TRUE, fecha_entrega= current_timestamp
            WHERE nro_pedido = $1`, [orderId]);
            const pedidoActualizado = response2.rows[0];
            res.send({ message: 'Pedido entregado', order: pedidoActualizado });
        } else {
            res.status(404).send({ message: 'Pedido no encontrado' });
        }
    })
);

// Para traer un pedido por id
orderRouter.get(
    '/:id',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const orderId = req.params.id;
        const response = await pool.query('SELECT * FROM vt_pedido_cab WHERE nro_pedido = $1',[orderId])
        if (response){
            const order = response.rows[0];
            res.send(order)
        } else {
            res.status(404).send({message: 'Pedido no encontrado'})
        }
    }),
)

export default orderRouter;