// menuRoutes.ts
import { Router } from 'express';
import { addFoodItem, deleteFoodItem, getFoodItemById, getFoodItems, updateFoodItem } from '../controllers/menuController';
/* import { authenticate, authorize } from '../middleware/authMiddleware'; */


const menuRouter = Router();

menuRouter.get('/',  getFoodItems);
menuRouter.get('/:id', getFoodItemById)
menuRouter.post('/add', /* authenticate, authorize(['admin']), */ addFoodItem);
menuRouter.put('/:id/edit', /* authenticate, authorize(['admin']), */ updateFoodItem);
menuRouter.delete('/:id/delete', /* authenticate, authorize(['admin']), */ deleteFoodItem);

export default menuRouter;
