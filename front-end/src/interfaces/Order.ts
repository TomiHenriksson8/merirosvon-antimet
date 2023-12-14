interface DetailedOrder {
    orderId: number;
    userId: number;
    totalPrice: string;
    orderDate: string;
    orderStatus: string;
    estimatedPickupTime: number;
    foodItemId: number;
    foodItemName: string;
    foodItemPrice: string;
    quantity: number;
}

interface OrdersResponse {
    orders: DetailedOrder[];
}

interface GroupedOrders {
    [orderId: number]: DetailedOrder[];
}

export { DetailedOrder, OrdersResponse, GroupedOrders };