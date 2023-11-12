import express from 'express';
import UserRouter from './routes/userRoutes';
import menuRouter from './routes/menuRoutes';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', UserRouter);
app.use('/api/menu', menuRouter);

const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
