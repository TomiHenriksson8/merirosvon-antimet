interface DetailedOrder {
    orderId: number;
    userId: number;
    totalPrice: string;
    orderDate: string;
    orderStatus: string;
    foodItemId: number;
    foodItemName: string;
    foodItemPrice: number;
    quantity: number;
}

interface OrdersResponse {
    orders: DetailedOrder[];
}

interface GroupedOrders {
    [orderId: number]: DetailedOrder[];
}

export { DetailedOrder, OrdersResponse, GroupedOrders };