import { Request, Response } from "express";
import { fetchAllOrders, fetchLatestOrderId } from "../data/orderData";

const getLatestOrderId = async (req: Request, res: Response) => {
    try {
        const latestOrderId = await fetchLatestOrderId();
        if (latestOrderId !== null) {
            res.status(200).json({ latestOrderId: latestOrderId });
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error fetching the latest order ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await fetchAllOrders();
        if (orders !== null) {
            res.status(200).json({ orders: orders });
        } else {
            res.status(404).json({ message: 'No orders found' });
        }
    } catch (error) {
        console.error('Error fetching all the orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



export { getLatestOrderId, getAllOrders };