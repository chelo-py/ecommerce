import expressAsyncHandler from 'express-async-handler';
import express from 'express';
import { isAdmin, isAuth } from '../util.js';
import pool from '../conexion.js';

const marcaRouter = express.Router();

// API para crear una marca
marcaRouter.post(
    '/crearmarca', // La dirección de donde vendrá el post
    isAuth, // Si está logueado 
    isAdmin, //Si es administrador
    expressAsyncHandler(async (req, res) => {// Realizamos una función asíncrona
        const { nombre, descripcion, logo } = req.body;
        const response = await pool.query(
            `INSERT INTO bs_marca(
                nombre, descripcion, logo)
               VALUES ( '${nombre}', '${descripcion}', '${logo}')`
        );
        const nuevaMarca = response.rows;
        res.send({
            message: 'Marca Creada',
            Marca: nuevaMarca[0],
        });
    })
);

// Api para listar marcas
marcaRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
        try {
            const marcas = await pool.query('SELECT * FROM bs_marca ORDER BY cod_marca ASC');
            res.send(marcas.rows)
        } catch (err) {
            console.error(err.message)
        }
    })
);

// Api top marcas
marcaRouter.get(
    '/top-marcas',
    expressAsyncHandler(async (req, res) => {
        try {
            const topMarcas = await pool.query('SELECT * FROM bs_marca ORDER BY cod_marca ASC LIMIT 2 OFFSET 0');
            res.send(topMarcas.rows);
        } catch (err) {
            console.error(err.message)
        }
    })
);

// Listar reseñas
marcaRouter.get(
    '/:id/reviews',
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const response = await pool.query(`SELECT * FROM vt_review_marca 
            WHERE cod_marca = $1`, [id]);
            const reviews = response.rows;
            res.send(reviews);
        } catch (err) {
            console.error(err.message)
        }
    })
)

// Traer marca por id
marcaRouter.get(
    '/:id',
    expressAsyncHandler(async (req, res) => {
        const { id } = req.params;
        const response = await pool.query(`SELECT m.cod_marca, m.nombre AS nombre_marca, descripcion, logo, imagen, num_reviews, 
        m.puntuacion AS marca_puntuacion, comentario, r.nombre AS nombre_persona, fecha,
        r.puntuacion AS persona_puntuacion
        FROM bs_marca AS m
        FULL JOIN vt_review_marca AS r ON m.cod_marca = r.cod_marca
        WHERE m.cod_marca = $1`, [id])
        const marca = response.rows[0];
        if (marca) {
            res.send(marca);
        } else {
            res.status(404).send({ message: 'Marca no encontrada' });
        }
    })
);

// Crear reseña
marcaRouter.post(
    '/:id/reviews',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const marcaId = req.params.id;
        const { comentario, nombre } = req.body;
        const puntuacion = Number(req.body.puntuacion);
        try {
            const prueba = await pool.query(` select cod_marca
                                                    , nombre
                                                    , sum(puntuacion) total_puntos
                                                    , count(1)        cantidad_registro
                                                FROM vt_review_marca 
                                                where cod_marca = $1
                                                  and nombre    = $2
                                                group by cod_marca
                                                       , nombre`, [marcaId, nombre]);
            const marca = prueba.rows;
            if (marca.length > 0) {
                res.status(404).send({ message: 'Ya has enviado una reseña' });
            } else {

                const response = await pool.query(`INSERT INTO vt_review_marca(
                    cod_marca, nombre, puntuacion, comentario, fecha)
                    VALUES ($1, $2, $3, $4, current_timestamp)`, [marcaId, nombre, puntuacion, comentario]);
                const review = response.rows[0];

                const response2 = await pool.query(`   select cod_marca
                                                            , sum(puntuacion) total_puntos
                                                            , count(1)        cantidad_registro
                                                        FROM vt_review_marca 
                                                        where cod_marca = $1
                                                        group by cod_marca`, [marcaId]);
                const marca = response2.rows[0];

                const promedio = parseInt(marca.total_puntos) / parseInt(marca.cantidad_registro);
                const response3 = await pool.query(`update bs_marca
                                                    set num_reviews = $1, 
                                                        puntuacion  = $2
                                                    where cod_marca   = $3
                                                    `, [marca.cantidad_registro, promedio, marcaId]);
                const marcaActualizada = response3.rows[0];

                res.send(review);
                res.send(marcaActualizada);
            }
        } catch (err) {
            res.status(404).send({ message: 'Error al insertar datos' });
        }
    })
)

export default marcaRouter;