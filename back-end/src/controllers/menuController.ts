import { Request, Response } from 'express';
import { FoodItem } from '../models/FoodItem';
import { menu } from '../test-data/menu';
import { addNewFoodItem, deleteFoodItemById, fetchAllFoodItems, fetchFoodItemById, updateExistingFoodItem } from '../data/menuData';

const getFoodItems = async (req: Request, res: Response) => {
    try {
      const foodItems = await fetchAllFoodItems();  // Assuming this function exists and fetches all food items from the database
      res.status(200).json(foodItems);
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

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

const addFoodItemHandler = async (req: Request, res: Response) => {
    try {
      await addNewFoodItem(req.body);
      res.status(201).json({ message: 'Food item added successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  

const updateFoodItemHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await updateExistingFoodItem(id, req.body);
      res.status(200).json({ message: 'Food item updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  

const deleteFoodItemHandler = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await deleteFoodItemById(id);
      res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
};
  

export { getFoodItems, getFoodItemByIdHandler, addFoodItemHandler, updateFoodItemHandler, deleteFoodItemHandler};