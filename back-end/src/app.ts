import express from 'express';
import router from './routes/userRoutes';
import menuRouter from './routes/menuRoutes';
import cartRouter from './routes/cartRoutes';
import orderRouter from './routes/orderRoutes';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

/**
 * @apiDefine Merirosvon Antimet
 */

/**
 * This is the main server file for the application.
 * It sets up the Express server, configures middleware,
 * and defines the main routes for the API.
 */

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/doc', express.static(path.join(__dirname, '../apidoc')));

app.use('/api/users', router);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter)

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


export default app;