import { promisePool } from "../database/database";
import { RowDataPacket } from 'mysql2';

const fetchAllOrders = async (): Promise<any> => {
    try {
        const sql = "SELECT * FROM `Order`";
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



export { fetchLatestOrderId, fetchAllOrders };
