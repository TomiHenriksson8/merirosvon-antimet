import { promisePool } from "../database/database";
import { RowDataPacket, ResultSetHeader } from 'mysql2';



const fetchAllOrders = async (): Promise<any> => {
    try {
        const sql = `
            SELECT 
                o.orderId, 
                o.userId, 
                o.totalPrice, 
                o.orderDate, 
                o.orderStatus, 
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

const fetchLatestOrderId = async (): Promise<number | null> => {
    try {
        const sql = 'SELECT orderId FROM `Order` ORDER BY orderId DESC LIMIT 1';
        const [rows] = await promisePool.query<RowDataPacket[]>(sql);
        if (rows.length > 0) {
            return rows[0].orderId;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching the latest order ID:', error);
        throw error;
    }
};

const updateOrderStatus = async (orderId: number, newStatus: string): Promise<number> => {
    try {
        const validStatuses = ['pending', 'completed', 'cancelled'];
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

export { fetchLatestOrderId, fetchAllOrders, updateOrderStatus, createOrderFromCart };
