
import { Router } from 'express';
import { getFoodItems, getFoodItemByIdHandler, getFoodItemsByCategoryHandler, addFoodItemHandler, updateFoodItemHandler, deleteFoodItemHandler } from '../controllers/menuController';
/* import { authenticate, authorize } from '../middleware/authMiddleware'; */


const menuRouter = Router();

menuRouter.get('/',  getFoodItems);
menuRouter.get('/:id', getFoodItemByIdHandler)
menuRouter.get('/category/:category', getFoodItemsByCategoryHandler);
menuRouter.post('/add', /* authenticate, authorize(['admin']), */ addFoodItemHandler);
menuRouter.put('/:id/edit', /* authenticate, authorize(['admin']), */ updateFoodItemHandler);
menuRouter.delete('/:id/delete', /* authenticate, authorize(['admin']), */ deleteFoodItemHandler);

export default menuRouter;


