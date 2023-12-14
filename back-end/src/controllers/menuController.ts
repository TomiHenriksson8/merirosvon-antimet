import { Request, Response } from 'express';
import { addNewFoodItem, deleteFoodItemById, fetchAllFoodItems, fetchFoodItemById, fetchFoodItemsByCategory, fetchFoodItemCount, updateExistingFoodItem } from '../data/menuData';


/**
 * @api {get} /menu Get all food items
 * @apiName  GetFoodItems
 * @apiGroup Menu
 * @apiPermission open to all
 * @apiSuccess {Object[]} foodItems Food items
 * @apiError ( 500 ) InternalServerError There was an issue getting the food items
 */
const getFoodItems = async (req: Request, res: Response) => {
    try {
      const foodItems = await fetchAllFoodItems();
      res.status(200).json(foodItems);
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
/**
 * @api {get} /menu/:id Get food item by id
 * @apiName  GetFoodItemById
 * @apiGroup Menu
 * @apiPermission open to all
 * @apiParam {Number} id Food item id
 * @apiSuccess {Object} foodItem Food item
 * @apiError ( 404 ) NotFound Food item not found
 */
const getFoodItemByIdHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const foodItem = await fetchFoodItemById(id);
      if (foodItem) {
        res.status(200).json(foodItem);
      } else {
        res.status(404).json({ message: 'Food item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @api {get} /menu/count Get food items count
 * @apiName  GetFoodItemsCount
 * @apiGroup Menu
 * @apiPermission open to all
 * @apiSuccess {Number} foodItemCount Food items count
 * @apiError ( 500 ) InternalServerError There was an issue getting the food items count
 * @apiError ( 404 ) NotFound Food items not found
 */
const getFoodItemsCountHandler = async (req: Request, res: Response) => {
  try {
    const foodItemCount = await fetchFoodItemCount();
    res.status(200).json({ itemCount: foodItemCount });
  } catch (error) {
    console.error('Error in getFoodItemsCountHandler:', error);
    res.status(500).json({ message: 'Internal server error', error});
  }
};

/**
 * @api {get} /menu/category/:category Get food items by category
 * @apiName  GetFoodItemsByCategory
 * @apiGroup Menu
 * @apiPermission open to all
 * @apiParam {String} category Food item category
 * @apiSuccess {Object[]} foodItems Food items
 * @apiError ( 404 ) NotFound No food items found for this category
 */
const getFoodItemsByCategoryHandler = async (req: Request, res: Response) => {
  try {
    const category = req.params.category;
    const foodItems = await fetchFoodItemsByCategory(category);
    if (foodItems.length > 0) {
      res.status(200).json(foodItems);
    } else {
      res.status(404).json({ message: 'No food items found for this category' });
    }
  } catch (error) {
    console.error('Error fetching food items by category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @api {post} /menu Add new food item
 * @apiName  AddFoodItem
 * @apiGroup Menu
 * @apiPermission admin
 * @apiParam {String} name Food item name
 * @apiParam {String} description Food item description
 * @apiParam {String} category Food item category
 * @apiParam {Number} price Food item price
 * @apiParam {String} image Food item image
 */
const addFoodItemHandler = async (req: Request, res: Response) => {
    try {
      await addNewFoodItem(req.body);
      res.status(201).json({ message: 'Food item added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
/**
 * @api {put} /menu/:id Update existing food item
 * @apiName  UpdateFoodItem
 * @apiGroup Menu
 * @apiPermission admin
 * @apiParam {Number} id Food item id
 * @apiParam {String} name Food item name
 * @apiParam {String} description Food item description
 * @apiParam {String} category Food item category
 * @apiParam {Number} price Food item price
 * @apiParam {String} image Food item image
 * @apiSuccess {String} message Food item updated successfully
 * @apiError ( 500 ) InternalServerError There was an issue updating the food item
 */ 
const updateFoodItemHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await updateExistingFoodItem(id, req.body);
      res.status(200).json({ message: 'Food item updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  
/**
 * @api {delete} /menu/:id Delete food item
 * @apiName  DeleteFoodItem
 * @apiGroup Menu
 * @apiPermission admin
 * @apiParam {Number} id Food item id
 * @apiSuccess {String} message Food item deleted successfully
 * @apiError ( 500 ) InternalServerError There was an issue deleting the food item
 */
const deleteFoodItemHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await deleteFoodItemById(id);
      res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  

export { getFoodItems, getFoodItemByIdHandler, addFoodItemHandler, getFoodItemsCountHandler, getFoodItemsByCategoryHandler, updateFoodItemHandler, deleteFoodItemHandler};