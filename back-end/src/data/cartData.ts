import { promisePool } from "../database/database";
import { RowDataPacket } from "mysql2";

/**
 * Rerieves the cart items for a user
 * @param {number} userId - The user ID 
 * @returns {Promise<any>} A promise that resolves to the cart of the specified user. 
 */
const getCartByUserId = async (userId: number): Promise<any> => {
  const [rows] = await promisePool.query(
    `
        SELECT FoodItem.*, Cart.quantity
        FROM Cart
        JOIN FoodItem ON Cart.foodItemId = FoodItem.id
        WHERE Cart.userId = ?
    `,
    [userId]
  );
  return rows;
};

/**
 * Adds an item to the cart
 * @param {number} userId - The user ID
 * @param {number} foodItemId - The food item ID
 * @param {number} quantity - The quantity of the food item
 * @returns {Promise<void>} A promise that resolves when the item has been added to the cart
 */
const addItemToCart = async (
    userId: number,
    foodItemId: number,
    quantity: number
  ): Promise<void> => {
    await promisePool.query(
      `
          INSERT INTO Cart (userId, foodItemId, quantity)
          VALUES (?, ?, ?)
      `,
      [userId, foodItemId, quantity]
    );
  };
  
  /**
   * removes an item from the cart
   * @param {number} userId 
   * @param {number} foodItemId
   * @returns {Promise<void>} A promise that resolves when the item has been removed from the cart   
   */
  const removeItemFromCart = async (userId: number, foodItemId: number): Promise<void> => {
    await promisePool.query(`
        DELETE FROM Cart 
        WHERE userId = ? AND foodItemId = ?
    `, [userId, foodItemId]);
};

/**
 * Clears the cart for a user
 * @param {number} userId
 * @returns {Promise<void>} A promise that resolves when the cart has been cleared
 */
const clearCart = async (userId: number): Promise<void> => {
  await promisePool.query(
    `
        DELETE FROM Cart 
        WHERE userId = ?
    `,
    [userId]
  );
};

/**
 * Updates the quantity of an item in the cart
 * @param {number} userId
 * @param {number} foodItemId
 * @param {number} newQuantity
 * @returns {Promise<void>} A promise that resolves when the item quantity has been updated
 */
const updateCartItemQuantity = async (
  userId: number,
  foodItemId: number,
  newQuantity: number
): Promise<void> => {
  await promisePool.query(
    `
        UPDATE Cart 
        SET quantity = ?
        WHERE userId = ? AND foodItemId = ?
    `,
    [newQuantity, userId, foodItemId]
  );
};

/**
 * Gets the total price of the cart
 * @param {number} userId
 * @returns {Promise<number>} A promise that resolves to the total price of the cart
 */
const getCartTotal = async (userId: number): Promise<number> => {
  const [rows] = await promisePool.query<RowDataPacket[]>(
    `
        SELECT SUM(FoodItem.price * Cart.quantity) AS total
        FROM Cart
        JOIN FoodItem ON Cart.foodItemId = FoodItem.id
        WHERE Cart.userId = ?
    `,
    [userId]
  );

  if (rows.length > 0 && "total" in rows[0] && rows[0].total != null) {
    return rows[0].total as number;
  } else {
    return 0;
  }
};

/**
 * Lists the items in the cart
 * @param {number} userId
 * @returns {Promise<any[]>} A promise that resolves to the items in the cart
 */
const listCartItems = async (userId: number): Promise<any[]> => {
  const [rows] = await promisePool.query(
    `
        SELECT FoodItem.*, Cart.quantity
        FROM Cart
        JOIN FoodItem ON Cart.foodItemId = FoodItem.id
        WHERE Cart.userId = ?
    `,
    [userId]
  );
  return rows as RowDataPacket[];
};


export {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
  getCartTotal,
  listCartItems
};
