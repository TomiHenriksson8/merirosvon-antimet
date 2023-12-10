import { Router } from 'express';
import { getCart, getCartTotalAmount, addToCart, removeFromCart, updateItemQuantityInCart } from '../controllers/cartController';
import { authenticate, authorize } from '../middleware/authMiddleware';


const cartRouter = Router();

cartRouter.get('/:userId', authenticate, getCart);
cartRouter.get('/total/:userId', authenticate, getCartTotalAmount);
cartRouter.post('/add', addToCart);
cartRouter.delete('/remove/:userId/:foodItemId', authenticate, removeFromCart);
cartRouter.patch('/update', authenticate, updateItemQuantityInCart);


export default cartRouter;