import express from 'express';
import pool from '../conexion.js';
import expressAsyncHandler from 'express-async-handler';
import { isAdmin, isAuth } from '../util.js';

const productoRouter = express.Router();

//Api para crear un producto
productoRouter.post(
    '/crearproducto',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { cod_marca, nombre, imagen, categoria, subcategoria, stock, descripcion } = req.body;
        const newProduct = await pool.query(
            `INSERT INTO vt_articulo(
                cod_marca, nombre, imagen, categoria, subcategoria, stock, descripcion)
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [cod_marca, nombre, imagen, categoria, subcategoria, stock, descripcion]
        )
        res.send({
            product: newProduct.rows[0]
        });
    })
);

// Listar productos
productoRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
        try {
            const productos = await pool.query(
                `SELECT cod_articulo, a.nombre, categoria, subcategoria, a.imagen AS articulo_imagen, a.puntuacion AS punt_articulo,
                a.nro_review AS review_articulo, m.nombre AS marca, m.cod_marca as codMarca, precio
                FROM vt_articulo AS a JOIN bs_marca AS m ON a.cod_marca = m.cod_marca 
                LIMIT 8 OFFSET 0`
            );
            res.send(productos.rows)
        } catch (err) {
            console.error(err.message)
        }
    })
);

// Listar productos con paginación
productoRouter.get(
    '/listar-productos',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const count = await pool.query(`SELECT COUNT(*) FROM vt_articulo`);
        const int = parseInt(count.rows[0].count)
        try {
            const response = await pool.query(
                `SELECT cod_articulo, a.nombre, categoria, subcategoria, a.imagen AS articulo_imagen, a.puntuacion AS punt_articulo,
                    a.nro_review AS review_articulo, m.nombre AS marca, a.cod_marca AS codmarca
                    FROM vt_articulo AS a JOIN bs_marca AS m ON a.cod_marca = m.cod_marca
                    ORDER BY a.cod_marca ASC 
                    LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`);
            const productos = response.rows;
            res.send({ productos, page, pages: Math.ceil(int / pageSize) });
        } catch (err) {
            console.error(err.message)
        }
    })
);

// Listar producto por marcas
productoRouter.get(
    '/listar',
    expressAsyncHandler(async (req, res) => {
        const marca = req.query.marca || '';
        const pageSize = 6;
        const page = Number(req.query.pageNumber) || 1;
        const response = await pool.query(`SELECT COUNT(*) FROM vt_articulo WHERE cod_marca = $1`, [marca])
        const count = parseInt(response.rows[0].count)
        try {
            const response = await pool.query(`SELECT cod_articulo, a.nombre, categoria, subcategoria, a.imagen AS articulo_imagen, a.puntuacion AS punt_articulo,
            a.nro_review AS review_articulo, m.nombre AS marca, m.cod_marca as codMarca, precio
            FROM vt_articulo AS a JOIN bs_marca AS m ON a.cod_marca = m.cod_marca 
            WHERE a.cod_marca = $1 LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`, [marca]);
            const productos = response.rows;
            res.send({ productos, page, pages: Math.ceil(count / pageSize) });
        } catch (err) {
            console.error(err.message);
        }
    })
)

// Listar producto por marcas 2
productoRouter.get(
    '/listar2',
    expressAsyncHandler(async (req, res) => {
        const productId = parseInt(req.query.articulo);
        const response = await pool.query(`SELECT * FROM vt_articulo WHERE cod_articulo  = $1`, [productId])
        const producto = response.rows[0];
        const { cod_marca } = producto;
        try {
            const response = await pool.query(`SELECT cod_articulo, a.nombre, categoria, subcategoria, a.imagen AS articulo_imagen, 
            a.puntuacion AS punt_articulo, a.nro_review AS review_articulo, m.nombre AS marca, m.cod_marca as codMarca, precio
            FROM vt_articulo AS a JOIN bs_marca AS m ON a.cod_marca = m.cod_marca 
            WHERE a.cod_marca = $1 LIMIT 8 OFFSET 0`, [cod_marca]);
            const productos = response.rows;
            res.send(productos);
        } catch (err) {
            console.error(err.message);
        }
    })
)

// Listar productos para el buscador
// productoRouter.get(
//     '/buscador',
//     expressAsyncHandler(async (req, res) => {
//         const pageSize = 6;
//         const page = Number(req.query.pageNumber) || 1;
//         const name = req.query.name || '';
//         const categoria = req.query.categoria || '';
//         const order = req.query.order || '';
//         const marca = req.query.marca || '';

//         // console.log(name);

//         const min =
//             req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
//         const max =
//             req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
//         const puntuacion =
//             req.query.puntuacion && Number(req.query.puntuacion) !== 0
//                 ? Number(req.query.puntuacion)
//                 : 0;

//         // const nombreFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
//         // const marcaFilter = marca ? { marca } : {};
//         // const categoriaFilter = categoria ? { categoria } : {};
//         // const precioFilter = min && max ? { precio: { $gte: min, $lte: max } } : {};
//         // const puntuacionFilter = puntuacion ? { puntuacion: { $gte: puntuacion } } : {};
//         // const sortOrder =
//         //     order === 'lowest'
//         //         ? { precio: 1 }
//         //         : order === 'highest'
//         //             ? { precio: -1 }
//         //             : order === 'toprated'
//         //                 ? { puntuacion: -1 }
//         //                 : { cod_articulo: -1 };

//         if ()


//             var sql = `Select *
//                      from vt_articulo a
//                     where 
//                   `;


//         // console.log(nombreFilter);

//         const result = await pool.query(sql);

//         // console.log(result.rows);
//         const products = result.rows;
//         const count = products.length;


//         // res.send({ message: 'Retorno', productos: [] })
//         res.send({ products, page, pages: Math.ceil(count / pageSize) });

//     })
// )

//Api para actualizar un producto
productoRouter.put(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { cod_articulo, nombre, imagen, categoria, subCategoria, stock, descripcion } = req.body;
        const response = await pool.query(`SELECT * FROM vt_articulo WHERE cod_articulo =$1`, [cod_articulo]);
        const producto = response.rows[0];
        if (producto) {
            const response2 = await pool.query(
                `UPDATE vt_articulo
                    SET nombre=$1, imagen=$2, categoria=$3, subCategoria=$4, stock=$5, descripcion=$6
                    WHERE cod_articulo =$7`,
                [nombre, imagen, categoria, subCategoria, stock, descripcion, cod_articulo]
            );
            const productoActualizado = response2.rows[0];
            res.send({ message: 'Producto actualizado!', producto: productoActualizado })
        } else {
            res.status(404).send({ message: 'Producto no encontrado.' })
        }
    })
);

//Eliminar un producto
productoRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const response = await pool.query(`SELECT * FROM vt_articulo WHERE cod_articulo =$1`, [id]);
        const producto = response.rows[0];
        if (producto) {
            const response2 = await pool.query(`DELETE FROM vt_articulo WHERE cod_articulo =$1`, [id]);
            const deleteProduct = response2.rows[0];
            res.send({ message: 'Producto eliminado', product: deleteProduct });
        } else {
            res.status(404).send({ message: 'Producto no encontrado' })
        }
    })
);

//API para listar productos por categorías
productoRouter.get(
    '/categorias',
    expressAsyncHandler(async (req, res) => {
        const response = await pool.query(`SELECT DISTINCT categoria FROM vt_articulo`);
        const categorias = response.rows;
        res.send(categorias);
    })
);

// Listar las reseñas
productoRouter.get(
    '/:id/reviews',
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const response = await pool.query(`SELECT * FROM vt_review_articulo
            WHERE cod_articulo = $1`, [id]);
            const reviews = response.rows;
            res.send(reviews);
        } catch (err) {
            console.error(err.message);
        }
    })
);

// Obtener producto por id
productoRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const response = await pool.query(`SELECT a.cod_articulo, a.cod_marca, a.nombre, a.imagen, categoria, subcategoria, stock,
        a.puntuacion AS articulo_puntuacion, nro_review, a.descripcion, m.nombre AS marca_nombre, precio,
        num_reviews, m.puntuacion AS puntuacion_marca, comentario, fecha, d.nombre AS nombre_persona,
		d.puntuacion AS puntuacion_persona
        FROM vt_articulo AS a 
        FULL JOIN bs_marca AS m ON a.cod_marca = m.cod_marca
        FULL JOIN vt_review_articulo AS d ON a.cod_articulo = d.cod_articulo
        WHERE a.cod_articulo = $1`, [id]);
        if (response) {
            const producto = response.rows[0];
            res.send(producto);
        } else {
            res.status(404).send({ message: 'Producto no encontrado' })
        }
    })
);

// Crear reseña
productoRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const productId = req.params.id;
        const { comentario, nombre } = req.body;
        const puntuacion = Number(req.body.puntuacion);
        try {
            const validar = await pool.query(` SELECT cod_articulo
                                                    , nombre
                                                    , sum(puntuacion) total_puntos
                                                    , count(1)        cantidad_registro
                                                FROM vt_review_articulo
                                                WHERE cod_articulo = $1
                                                    AND nombre     = $2
                                                GROUP BY cod_articulo
                                                        , nombre`, [productId, nombre]);
            const producto = validar.rows;
            if (producto.length > 0) {
                res.status(404).send({ message: 'Ya has enviado una reseña' })
            } else {
                const response = await pool.query(` INSERT INTO vt_review_articulo(
                    cod_articulo, nombre, puntuacion, comentario, fecha)
                    VALUES ($1, $2, $3, $4, current_timestamp)`, [productId, nombre, puntuacion, comentario])
                const review = response.rows[0];
                const response2 = await pool.query(`    SELECT cod_articulo
                                                    , sum(puntuacion) total_puntos
                                                    , count(1)        cantidad_registro
                                                FROM vt_review_articulo
                                                WHERE cod_articulo = $1
                                                GROUP BY cod_articulo`, [productId])
                const producto = response2.rows[0];
                const promedio = parseInt(producto.total_puntos) / parseInt(producto.cantidad_registro)
                const response3 = await pool.query(`update vt_articulo
                                                    SET nro_review = $1,
                                                        puntuacion = $2
                                                    WHERE cod_articulo = $3`,
                    [producto.cantidad_registro, promedio, productId])
                const productoActualizado = response3.rows[0];
                res.send(review);
                res.send(productoActualizado)
            }
        } catch (err) {
            res.status(404).send({ message: 'Error al insertar datos' });
        }
    })
)

export default productoRouter;