// import express from 'express';
// import ListaPrecio from '../models/listaPrecioModel.js';
// import expressAsyncHandler from 'express-async-handler'
// import { isAdmin, isAuth } from '../util.js';

// const listaPrecioRouter = express.Router();

// listaPrecioRouter.get(
//     '/',
//     expressAsyncHandler(async (req, res) => {
//         const precio = await ListaPrecio.find();
//         res.send(precio);
//     })
// );

// listaPrecioRouter.post(
//     '/crearlistaprecio',
//     isAuth,
//     isAdmin,
//     expressAsyncHandler(async (req, res) => {
//         const listaprecio = new ListaPrecio({
//             producto: req.body.producto,
//             referencia: req.body.referencia,
//             descuento: req.body.descuento,
//             precio: req.body.precio,
//         });
//         const listaPrecioCreada = await listaprecio.save();
//         res.send({ message: 'Lista precio creada', listaprecio: listaPrecioCreada });
//     })
// );

// export default listaPrecioRouter;