
import { promisePool } from "../database/database";
import { RowDataPacket } from 'mysql2';


/**
 * Retrieves all food items
 * @returns {Promise<RowDataPacket[]>} A promise that resolves to all food items
 * @throws {Error} An error that contains the error code and message
 */
const fetchAllFoodItems = async (): Promise<RowDataPacket[]> => {
    try {
      const sql = 'SELECT * FROM FoodItem';
      const [rows] = await promisePool.query<RowDataPacket[]>(sql);
      return rows as RowDataPacket[];
    } catch (error) {
      throw error;
    }
  };

/**
 * Retrieves a food item by id
 * @param {number} id - The food item id
 * @returns {Promise<RowDataPacket[]>} A promise that resolves to the food item
 * @throws {Error} An error that contains the error code and message
 */
const fetchFoodItemById = async (id: number): Promise<RowDataPacket[]> => {
  try {
    const sql = 'SELECT * FROM FoodItem WHERE id = ?';
    const [rows] = await promisePool.query<RowDataPacket[]>(sql, [id]);
    return rows[0] as RowDataPacket[];
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves food items by category
 * @param {string} category - The food item category
 * @returns {Promise<RowDataPacket[]>} A promise that resolves to the food items
 * @throws {Error} An error that contains the error code and message
 */
const fetchFoodItemsByCategory = async (category: string): Promise<RowDataPacket[]> => {
  try {
    const sql = 'SELECT * FROM FoodItem WHERE category = ?';
    const [rows] = await promisePool.query<RowDataPacket[]>(sql, [category]);
    return rows as RowDataPacket[];
  } catch (error) {
    throw error;
  }
};

/**
 * Adds a new food item
 * @param {any} foodItem - The food item to add
 * @returns {Promise<void>} A promise that resolves when the food item has been added
 * @throws {Error} An error that contains the error code and message
 */
const addNewFoodItem = async (foodItem: any): Promise<void> => {
    try {
      const { name, description, price, category, imageUrl } = foodItem;
      const sql = 'INSERT INTO FoodItem (name, description, price, category, imageUrl) VALUES (?, ?, ?, ?, ?)';
      await promisePool.query(sql, [name, description, price, category, imageUrl]);
    } catch (error) {
      throw error;
    }
};

/**
 * Updates an existing food item
 * @param {number} id - The food item id
 * @param {any} foodItem - The food item to update
 * @returns {Promise<void>} A promise that resolves when the food item has been updated
 * @throws {Error} An error that contains the error code and message
 */
const updateExistingFoodItem = async (id: number, foodItem: any): Promise<void> => {
    try {
      const { name, description, price, category, imageUrl } = foodItem;
      const sql = 'UPDATE FoodItem SET name = ?, description = ?, price = ?, category = ?, imageUrl = ? WHERE id = ?';
      await promisePool.query(sql, [name, description, price, category, imageUrl, id]);
    } catch (error) {
      throw error;
    }
};

/**
 * Deletes a food item by id
 * @param {number} id - The food item id
 * @returns {Promise<void>} A promise that resolves when the food item has been deleted
 * @throws {Error} An error that contains the error code and message
 */
const deleteFoodItemById = async (id: number): Promise<void> => {
    try {
      const sql = 'DELETE FROM FoodItem WHERE id = ?';
      await promisePool.query(sql, [id]);
    } catch (error) {
      throw error;
    }
  };
  

export { 
  fetchAllFoodItems,
  fetchFoodItemById,
  fetchFoodItemsByCategory,
  addNewFoodItem,
  updateExistingFoodItem,
  deleteFoodItemById
};
  
  
