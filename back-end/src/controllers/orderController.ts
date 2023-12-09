import { Request, Response } from "express";
import { fetchAllOrders, fetchOrderCount, updateOrderStatus, createOrderFromCart, fetchOrdersByUserId,  } from "../data/orderData";
import { listCartItems } from "../data/cartData";

/**
 * @api {get} /order/count Get the latest order ID
 * @apiName  GetOrderCount
 * @apiGroup Order
 * @apiSuccess {Number} latestOrderId Latest order ID
 * @apiError ( 500 ) InternalServerError There was an issue getting the latest order ID
 */
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

/**
 * @api {get} /order/all Get all orders
 * @apiName  GetAllOrders
 * @apiGroup Order
 * @apiSuccess {Object[]} orders Orders
 * @apiError ( 500 ) InternalServerError There was an issue getting the orders
 */
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

/**
 * @api {get} /order/:orderid Get order by ID
 * @apiName  GetOrderById
 * @apiGroup Order
 * @apiParam {Number} orderid Order ID
 * @apiSuccess {Object} order Order
 * @apiError ( 500 ) InternalServerError There was an issue getting the order
 */
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

/**
 * @api {put} /order/:orderid Change order status
 * @apiName  ChangeOrderStatus
 * @apiGroup Order
 * @apiParam {Number} orderid Order ID
 * @apiParam {String} newStatus New order status
 * @apiSuccess {String} message Order status updated successfully
 * @apiError ( 500 ) InternalServerError There was an issue updating the order status
 */
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

/**
 * @api {post} /order Create new order
 * @apiName  CreateOrder
 * @apiGroup Order
 * @apiParam {Number} userId User ID
 * @apiSuccess {String} message Order created successfully
 * @apiSuccess {Number} orderId Order ID
 * @apiError ( 500 ) InternalServerError There was an issue creating the order
 */
const createOrderController = async (req: Request, res: Response) => {
    const userId = req.body.userId;
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