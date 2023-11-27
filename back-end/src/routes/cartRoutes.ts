import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
/* import { authenticate, authorize } from '../middleware/authMiddleware'; */

const cartRouter = Router();

cartRouter.get('/:userId', getCart);
cartRouter.post('/add', addToCart);
cartRouter.delete('/remove/:userId/:foodItemId', removeFromCart);


export default cartRouter;