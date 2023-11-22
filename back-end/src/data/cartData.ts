import { promisePool } from "../database/database";
import { RowDataPacket } from 'mysql2';


const getCartByUserId = async (userId: number): Promise<any> => {
    const [rows] = await promisePool.query(`
        SELECT FoodItem.*, Cart.quantity
        FROM Cart
        JOIN FoodItem ON Cart.foodItemId = FoodItem.id
        WHERE Cart.userId = ?
    `, [userId]);
    return rows;
};

const addItemToCart = async (userId: number, foodItemId: number, quantity: number): Promise<void> => {
    await promisePool.query(`
        INSERT INTO Cart (userId, foodItemId, quantity)
        VALUES (?, ?, ?)
    `, [userId, foodItemId, quantity]);
};

const removeItemFromCart = async (userId: number, foodItemId: number): Promise<void> => {
    await promisePool.query(`
        DELETE FROM Cart 
        WHERE userId = ? AND foodItemId = ?
    `, [userId, foodItemId]);
};

const clearCart = async (userId: number): Promise<void> => {
    await promisePool.query(`
        DELETE FROM Cart 
        WHERE userId = ?
    `, [userId]);
};

const updateCartItemQuantity = async (userId: number, foodItemId: number, newQuantity: number): Promise<void> => {
    await promisePool.query(`
        UPDATE Cart 
        SET quantity = ?
        WHERE userId = ? AND foodItemId = ?
    `, [newQuantity, userId, foodItemId]);
};

const getCartTotal = async (userId: number): Promise<number> => {
    const [rows] = await promisePool.query<RowDataPacket[]>(`
        SELECT SUM(FoodItem.price * Cart.quantity) AS total
        FROM Cart
        JOIN FoodItem ON Cart.foodItemId = FoodItem.id
        WHERE Cart.userId = ?
    `, [userId]);

    if (rows.length > 0 && 'total' in rows[0] && rows[0].total != null) {
        return rows[0].total as number;
    } else {
        return 0;
    }
};

const listCartItems = async (userId: number): Promise<any[]> => {
    const [rows] = await promisePool.query(`
        SELECT FoodItem.*, Cart.quantity
        FROM Cart
        JOIN FoodItem ON Cart.foodItemId = FoodItem.id
        WHERE Cart.userId = ?
    `, [userId]);
    return rows as RowDataPacket[];
};


const checkoutCart = async (userId: number) => {
    // TODO: Implement this function
};




export { getCartByUserId, addItemToCart, removeItemFromCart, clearCart, updateCartItemQuantity, getCartTotal, listCartItems, checkoutCart };