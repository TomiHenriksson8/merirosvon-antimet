interface Order {
    orderId: number;
    userId: number;
    totalPrice: string;
    orderDate: string; // Adjust the type if you are using a Date object
    orderStatus: string;
}

interface OrdersResponse {
    orders: Order[];
}

export { Order, OrdersResponse };