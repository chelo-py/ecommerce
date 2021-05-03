import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import userRouter from './routers/userRouter.js';
import orderRouter from './routers/orderRouters.js';
import uploadRouter from './routers/uploadRouter.js';
// import listaPrecioRouter from './routers/listaPrecioRouter.js'
import marcaRouter from './routers/marcaRouter.js';
import productoRouter from './routers/productoRouter.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/productos', productoRouter);
app.use('/api/marca', marcaRouter);
//app.use('/api/')
app.use('/api/orders', orderRouter);
// app.use('/api/listaPrecio', listaPrecioRouter);
//process.env.PAYPAL_CLIENT_ID || 
app.get('/api/config/paypal', (req, res) => {
  res.send('sb');
});
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});
//Línea de código que nos sirve para mostrar nuestras imágenes en el frontend
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
  res.send('Server is ready');
});
app.use((err, req, res) => {
  res.status(500).send({ message: err.message });
});
const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`);
});