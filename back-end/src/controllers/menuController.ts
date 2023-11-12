import { Request, Response } from 'express';
import { FoodItem } from '../models/FoodItem';
import { menu } from '../test-data/menu';

const getFoodItems = (req: Request, res: Response) => {
    res.status(200).json(menu);
}

const getFoodItemById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const foodItem = menu.find(foodItem => foodItem.id === id);
    if (foodItem) {
        res.status(200).json(foodItem);
    } else {
        res.status(404).json({ message: 'Food item not found' });
    }
}

const addFoodItem = (req: Request, res: Response) => {
    const { name, description, price, category, imageUrl } = req.body;
    const newFoodItem: FoodItem = {
        id: menu.length + 1,
        name,
        description,
        price,
        category,
        imageUrl
    };
    menu.push(newFoodItem);
    res.status(201).json(newFoodItem);
};

const updateFoodItem = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { ...updateData } = req.body;
    const index = menu.findIndex(foodItem => foodItem.id === id);
    if (index !== -1) {
        menu[index] = { ...menu[index], ...updateData };
        res.status(200).json(menu[index]);
    } else {
        res.status(404).json({ message: 'Food item not found' });
    }
}

const deleteFoodItem = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = menu.findIndex(foodItem => foodItem.id === id);
    if (index !== -1) {
        menu.splice(index, 1);
        res.status(200).json({ message: 'Food item deleted successfully' });
    } else {
        res.status(404).json({ message: 'Food item not found' });
    }
}

export { getFoodItems, getFoodItemById, addFoodItem, updateFoodItem, deleteFoodItem };