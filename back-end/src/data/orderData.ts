import { promisePool } from "../database/database";
import { RowDataPacket, ResultSetHeader } from 'mysql2';


/**
 * Retrieves all orders
 * @returns {Promise<any>} A promise that resolves to all orders
 * @throws {Error} An error that contains the error code and message
 */
const fetchAllOrders = async (): Promise<any> => {
    try {
        const sql = `
            SELECT 
                o.orderId, 
                o.userId, 
                o.totalPrice, 
                o.orderDate, 
                o.orderStatus,
                o.estimatedPickupTime, 
                od.foodItemId, 
                f.name AS foodItemName, 
                f.price AS foodItemPrice, 
                od.quantity 
            FROM \`Order\` o
            JOIN OrderDetails od ON o.orderId = od.orderId
            JOIN FoodItem f ON od.foodItemId = f.id;
        `;
        const [rows] = await promisePool.query<RowDataPacket[]>(sql);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching all orders:', error);
        throw error;
    }
};

/**
 * Retrieves orders by user id
 * @param {number} userId - The user id
 * @returns {Promise<any>} A promise that resolves to the orders
 * @throws {Error} An error that contains the error code and message
 */
const fetchOrdersByUserId = async (userId: number): Promise<any> => {  
    try {
        const sql = `
            SELECT 
                o.orderId, 
                o.userId, 
                o.totalPrice, 
                o.orderDate, 
                o.orderStatus,
                o.estimatedPickupTime, 
                od.foodItemId, 
                f.name AS foodItemName, 
                f.price AS foodItemPrice, 
                od.quantity 
            FROM \`Order\` o
            JOIN OrderDetails od ON o.orderId = od.orderId
            JOIN FoodItem f ON od.foodItemId = f.id
            WHERE o.userId = ?;
        `;
        const [rows] = await promisePool.query<RowDataPacket[]>(sql, [userId]);
        if (rows.length > 0) {
            return rows;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error fetching orders for user with ID ${userId}:`, error);
        throw error;
    }
};

/**
 * Retrieves the number of orders
 * @returns {Promise<number>} A promise that resolves to the number of orders
 * @throws {Error} An error that contains the error code and message
*/ 
const fetchOrderCount = async (): Promise<number> => {
    try {
        const sql = 'SELECT COUNT(*) AS orderCount FROM `Order`';
        const [rows] = await promisePool.query<RowDataPacket[]>(sql);
        return rows[0].orderCount;
    } catch (error) {
        console.error('Error fetching order count:', error);
        throw error;
    }
};

/**
 * Updates the status of an order
 * @param {number} orderId - The order id
 * @param {string} newStatus - The new order status
 * @returns {Promise<number>} A promise that resolves to the number of affected rows
 * @throws {Error} An error that contains the error code and message
 */
const updateOrderStatus = async (orderId: number, newStatus: string): Promise<number> => {
    try {
        const validStatuses = ['pending', 'accepted', 'completed', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid order status');
        }
        const sql = `
            UPDATE \`Order\`
            SET orderStatus = ?
            WHERE orderId = ?;
        `;
        const [result] = await promisePool.query<ResultSetHeader>(sql, [newStatus, orderId]);
        return result.affectedRows; 
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};

/**
 * Updates the estimated pickup time of an order
 * @param {number} orderId - The order id
 * @param {number} estimatedPickupTime - The new estimated pickup time
 * @returns {Promise<number>} A promise that resolves to the number of affected rows
 * @throws {Error} An error that contains the error code and message
 */
const updateOrderEstimatedPickupTime = async (orderId: number, estimatedPickupTime: number): Promise<number> => {
    try {
        const sql = `
            UPDATE \`Order\`
            SET estimatedPickupTime = ?
            WHERE orderId = ?;
        `;
        const [result] = await promisePool.query<ResultSetHeader>(sql, [estimatedPickupTime, orderId]);
        return result.affectedRows; 
    } catch (error) {
        console.error('Error updating order estimated pickup time:', error);
        throw error;
    }
};

/**
 * Creates an order from the user's cart
 * @param {number} userId - The user id
 * @returns {Promise<void>} A promise that resolves when the order has been created
 * @throws {Error} An error that contains the error code and message
 */
const createOrderFromCart = async (userId: number) => {
    try {
        // Retrieve cart items along with their foodItemId
        const [cartItems] = await promisePool.query<RowDataPacket[]>(
            `SELECT Cart.foodItemId, FoodItem.price, Cart.quantity 
             FROM Cart 
             JOIN FoodItem ON Cart.foodItemId = FoodItem.id 
             WHERE Cart.userId = ?`, 
            [userId]
        );
        // Calculate the total price of the order
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        // Insert the new order into the Order table
        const [orderResult] = await promisePool.query<ResultSetHeader>(
            `INSERT INTO \`Order\` (userId, totalPrice, orderDate, orderStatus) 
             VALUES (?, ?, NOW(), 'pending')`, 
            [userId, totalPrice]
        );
        const orderId = orderResult.insertId;
        // Insert each cart item into the OrderDetails table
        for (const item of cartItems) {
            await promisePool.query(
                `INSERT INTO OrderDetails (orderId, foodItemId, quantity) 
                 VALUES (?, ?, ?)`, 
                [orderId, item.foodItemId, item.quantity]
            );
        }
        // Clear the user's cart
        await promisePool.query(
            `DELETE FROM Cart WHERE userId = ?`, 
            [userId]
        );
    } catch (error) {
        console.error('Error creating order from cart:', error);
        throw error;
    }
};


export {
    fetchOrderCount,
    fetchAllOrders,
    fetchOrdersByUserId,
    updateOrderStatus,
    updateOrderEstimatedPickupTime,
    createOrderFromCart
};
