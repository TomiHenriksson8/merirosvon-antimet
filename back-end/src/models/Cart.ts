interface Cart {
    cartId: number;
    userId: number; // This will link back to the User table
    items: CartItem[];
  }
  
  interface CartItem {
    cartItemId: number;
    cartId: number; // This will link back to the Cart table
    foodItemId: number; // This links to the FoodItem table
    quantity: number;
    priceAtTimeOfAddition: number; // This could represent the price when the item was added to the cart
  }

  
  export { Cart, CartItem };