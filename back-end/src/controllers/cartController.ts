import { Request, Response } from 'express';
import  { getCartByUserId, addItemToCart, removeItemFromCart, clearCart, updateCartItemQuantity, getCartTotal, listCartItems, checkoutCart } from '../data/cartData';


/**
 * @api {get} /cart/:userId Get cart by user id
 * @apiName  GetCartByUserId
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiSuccess {Object[]} cart Cart items
 * @apiError ( 500 ) InternalServerError There was an issue getting the cart
 */
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

/**
 * @api {post} /cart/add Add item to cart
 * @apiName  AddItemToCart
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiParam {Number} foodItemId Food item id
 * @apiParam {Number} quantity Quantity of the food item
 * @apiSuccess {Object[]} cart Updated cart
 * @apiError ( 500 ) InternalServerError There was an issue adding the item to the cart
 */
const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, foodItemId, quantity } = req.body;
        
        // Call function to add the item to the cart
        await addItemToCart(userId, foodItemId, quantity);

        // Call function to get the updated cart
        const updatedCart = await getCartByUserId(userId);

        res.json(updatedCart);
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
};

/**
 * @api {delete} /cart/remove/:userId/:foodItemId Remove item from cart
 * @apiName  RemoveItemFromCart
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiParam {Number} foodItemId Food item id
 * @apiSuccess {String} message Item removed successfully
 * @apiError ( 500 ) InternalServerError There was an issue removing the item from the cart
 */
const removeFromCart = async (req: Request, res: Response) => {
    try {
        const { userId, foodItemId } = req.params;
        await removeItemFromCart(parseInt(userId), parseInt(foodItemId));
        res.status(200).json({ message: "Item removed successfully" });
    } catch (error) {
        const e = error as Error;
        res.status(500).send(e.message);
    }
};

/**
 * @api {delete} /cart/clear/:userId Clear user cart
 * @apiName  ClearUserCart
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiSuccess {String} message Cart cleared successfully
 * @apiError ( 500 ) InternalServerError There was an issue clearing the cart
 */
const clearUserCart = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        await clearCart(userId);
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

/**
 * @api {patch} /cart/update Update item quantity in cart
 * @apiName  UpdateItemQuantityInCart
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiParam {Number} foodItemId Food item id
 * @apiParam {Number} newQuantity New quantity of the food item
 * @apiSuccess {String} message Cart item quantity updated successfully
 * @apiError ( 500 ) InternalServerError There was an issue updating the cart item quantity
 */
const updateItemQuantityInCart = async (req: Request, res: Response) => {
    try {
        const { userId, foodItemId, newQuantity } = req.body;
        await updateCartItemQuantity(userId, foodItemId, newQuantity);
        res.status(200).json({ message: 'Cart item quantity updated successfully' });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

/**
 * @api {get} /cart/total/:userId Get cart total amount
 * @apiName  GetCartTotalAmount
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiSuccess {Number} total Total amount of the cart
 * @apiError ( 500 ) InternalServerError There was an issue getting the cart total
 */
const getCartTotalAmount = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const total = await getCartTotal(userId);
        res.json({ total });
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

/**
 * @api {get} /cart/items/:userId Get cart items
 * @apiName  ListItemsInCart
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiSuccess {Object[]} items Items in the cart
 * @apiError ( 500 ) InternalServerError There was an issue getting the cart items
 */
const listItemsInCart = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const items = await listCartItems(userId);
        res.json(items);
    } catch (error) {
        res.status(500).send('Internal server error');
    }
};

/**
 * @api {post} /cart/checkout/:userId Checkout user cart
 * @apiName  CheckoutUserCart
 * @apiGroup Cart
 * @apiParam {Number} userId User id
 * @apiSuccess {String} message Checkout successful
 * @apiError ( 500 ) InternalServerError There was an issue checking out the cart
 */
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