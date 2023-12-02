import { Router } from 'express';
import { getAllOrders, getLatestOrderId } from '../controllers/orderController';


const orderRouter = Router();

orderRouter.get('/latest/id', getLatestOrderId );
orderRouter.get('/all', getAllOrders );

export default orderRouter;