import { FoodItem } from "../models/FoodItem";
import { promisePool } from "../database/database";
import { RowDataPacket } from 'mysql2';


const fetchAllFoodItems = async (): Promise<RowDataPacket[]> => {
    try {
      const sql = 'SELECT * FROM FoodItem';
      const [rows] = await promisePool.query<RowDataPacket[]>(sql);
      return rows as RowDataPacket[]; // Explicitly casting it to RowDataPacket[]
    } catch (error) {
      throw error; // Add better error handling as needed
    }
  };

const fetchFoodItemById = async (id: number): Promise<RowDataPacket[]> => {
  try {
    const sql = 'SELECT * FROM FoodItem WHERE id = ?';
    const [rows] = await promisePool.query<RowDataPacket[]>(sql, [id]);
    return rows[0] as RowDataPacket[];
  } catch (error) {
    throw error;
  }
};

const addNewFoodItem = async (foodItem: any): Promise<void> => {
    try {
      const { name, description, price, category, imageUrl } = foodItem;
      const sql = 'INSERT INTO FoodItem (name, description, price, category, imageUrl) VALUES (?, ?, ?, ?, ?)';
      await promisePool.query(sql, [name, description, price, category, imageUrl]);
    } catch (error) {
      throw error;
    }
};
  
const updateExistingFoodItem = async (id: number, foodItem: any): Promise<void> => {
    try {
      const { name, description, price, category, imageUrl } = foodItem;
      const sql = 'UPDATE FoodItem SET name = ?, description = ?, price = ?, category = ?, imageUrl = ? WHERE id = ?';
      await promisePool.query(sql, [name, description, price, category, imageUrl, id]);
    } catch (error) {
      throw error;
    }
};

const deleteFoodItemById = async (id: number): Promise<void> => {
    try {
      const sql = 'DELETE FROM FoodItem WHERE id = ?';
      await promisePool.query(sql, [id]);
    } catch (error) {
      throw error;
    }
  };
  

export { fetchAllFoodItems, fetchFoodItemById, addNewFoodItem, updateExistingFoodItem, deleteFoodItemById};
  
  
