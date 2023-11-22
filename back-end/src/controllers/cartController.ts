import { Request, Response } from 'express';
import  { getCartByUserId, addItemToCart, removeItemFromCart, clearCart, updateCartItemQuantity, getCartTotal, listCartItems, checkoutCart } from '../data/cartData';

const getCart = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const cart = await getCartByUserId(userId);
        res.json(cart);
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
};

const addToCart = async (req: Request, res: Response) => {
    try {
        const { userId, foodItemId, quantity } = req.body;
        const updatedCart = await addItemToCart(userId, foodItemId, quantity);
        res.json(updatedCart);
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
};

const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { cartId, foodItemId } = req.body;
        await removeItemFromCart(cartId, foodItemId);
        res.status(204).send(); // No content to send back
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
};

const clearUserCart = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        await clearCart(userId);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

const updateItemQuantityInCart = async (req: Request, res: Response) => {
    try {
        const { cartId, foodItemId, newQuantity } = req.body;
        await updateCartItemQuantity(cartId, foodItemId, newQuantity);
        res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

const getCartTotalAmount = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const total = await getCartTotal(userId);
        res.json({ total });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

const listItemsInCart = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const items = await listCartItems(userId);
        res.json(items);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

const checkoutUserCart = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        await checkoutCart(userId);
        res.status(200).json({ message: 'Checkout successful' });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};


export { getCart, addToCart, removeFromCart, clearUserCart, updateItemQuantityInCart, getCartTotalAmount, listItemsInCart, checkoutUserCart };