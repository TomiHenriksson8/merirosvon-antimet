import { Request, Response } from "express";
import { fetchAllOrders, fetchOrderCount, updateOrderStatus, createOrderFromCart, fetchOrdersByUserId,  } from "../data/orderData";
import { listCartItems } from "../data/cartData";

const getOrderCount = async (req: Request, res: Response) => {
    try {
        const latestOrderId = await fetchOrderCount();
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

const getOrderById = async (req: Request, res: Response) => {
    const { orderid } = req.params;
    try {
        const numericOrderId = parseInt(orderid, 10);
        if (isNaN(numericOrderId)) {
            return res.status(400).json({ message: "Invalid order ID provided." });
        }
        const order = await fetchOrdersByUserId(numericOrderId);
        if (order !== null) {
            res.status(200).json({ order: order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const changeOrderStatusController = async (req: Request, res: Response) => {
    const { orderid } = req.params;
    const { newStatus } = req.body;
    try {
        const numericOrderId = parseInt(orderid, 10);
        if (isNaN(numericOrderId)) {
            return res.status(400).json({ message: "Invalid order ID provided." });
        }
        const affectedRows = await updateOrderStatus(numericOrderId, newStatus);
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Order not found or no changes made." });
        }
        res.json({ message: `Order status updated successfully for order ID ${numericOrderId}.` });
    } catch (error) {
        console.error('Error in changeOrderStatusController:', error);
        res.status(500).json({ message: "Internal server error when updating order status." });
    }
};

const createOrderController = async (req: Request, res: Response) => {
    const userId = req.body.userId; // Assuming userId is sent in the request body

    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const cartItems = await listCartItems(userId);
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cannot create an order with an empty cart.' });
        }
        const orderId = await createOrderFromCart(userId);
        res.status(200).json({ message: 'Order created successfully', orderId: orderId });
    } catch (error) {
        console.error('Error in createOrderController:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export { getOrderCount, getAllOrders, getOrderById, changeOrderStatusController, createOrderController };