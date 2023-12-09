import { Router } from 'express';
import { getCart, getCartTotalAmount, addToCart, removeFromCart, updateItemQuantityInCart } from '../controllers/cartController';
import { updateCartItemQuantity } from '../data/cartData';
/* import { authenticate, authorize } from '../middleware/authMiddleware'; */

const cartRouter = Router();

cartRouter.get('/:userId', getCart);
cartRouter.get('/total/:userId', getCartTotalAmount);
cartRouter.post('/add', addToCart);
cartRouter.delete('/remove/:userId/:foodItemId', removeFromCart);
cartRouter.patch('/update', updateItemQuantityInCart)

export default cartRouter;