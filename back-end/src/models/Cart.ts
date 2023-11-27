interface Cart {
    cartId: number;
    userId: number; 
    items: CartItem[];
  }
  
  interface CartItem {
    cartItemId: number;
    cartId: number; 
    foodItemId: number;
    quantity: number;
    priceAtTimeOfAddition: number; 
  }

  
  export { Cart, CartItem };