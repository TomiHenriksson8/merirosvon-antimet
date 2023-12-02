import { getCurrentUser } from '../../utils/utils.js';
import { Order, OrdersResponse } from '../../interfaces/Order.js';

const redirectToAppropriatePage = () => {
    const currentUser = getCurrentUser();
    const currentPath = window.location.pathname;

    if (!currentUser || currentUser.role === "user") {
        if (!currentPath.endsWith('index.html')) {
            window.location.href = "index.html";
        }
    } else if (currentUser.role === 'admin' || currentUser.role === 'staff') {
        if (!currentPath.endsWith('adminAndStaffPanel.html')) {
            window.location.href = "adminAndStaffPanel.html";
        }
    }
}

redirectToAppropriatePage();

document.getElementById('exit-panel')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    console.log("Panel exited successfully");
    redirectToAppropriatePage();
});

// Box with amount of users
const showAmountOfUsers = async () => {
    const url = 'http://localhost:8000/api/users/latest/id';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const latestUserId = responseData.latestUserId;
        const amountOfUsersElement = document.getElementById('users-box');
        if (amountOfUsersElement) {
            amountOfUsersElement.innerHTML = `Total Users: ${latestUserId}`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

showAmountOfUsers();

// Box with amount of orders
const showAmountOfOrders = async () => {
    const url = 'http://localhost:8000/api/order/latest/id';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const latestOrderId = responseData.latestOrderId;
        const amountOfOrdersElement = document.getElementById('orders-box');
        if (amountOfOrdersElement) {
            amountOfOrdersElement.innerHTML = `Total Orders: ${latestOrderId}`;
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

showAmountOfOrders();

// ORDER LIST

const getOrders = async (): Promise<OrdersResponse> => {
    const url = 'http://localhost:8000/api/order/all';
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData: OrdersResponse = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrowing the error for the caller to handle
    }
};

const displayOrders = async () => {
    try {
        const ordersData = await getOrders();
        if (!ordersData.orders || ordersData.orders.length === 0) {
            console.error('Failed to retrieve orders data');
            return;
        }
        const tableContainer = document.getElementById('orders-table-container');
        if (!tableContainer) {
            console.error('Table container not found');
            return;
        }

        const table = document.createElement('table');
        // Add table headers
        const headerRow = table.insertRow();
        ['Order ID', 'User ID', 'Total Price', 'Order Date', 'Order Status'].forEach(text => {
            const cell = headerRow.insertCell();
            cell.textContent = text;
        });

        // Add table rows for each order
        ordersData.orders.forEach(order => {
            const row = table.insertRow();
            row.insertCell().textContent = order.orderId.toString();
            row.insertCell().textContent = order.userId.toString();
            row.insertCell().textContent = order.totalPrice;
            row.insertCell().textContent = order.orderDate;
            row.insertCell().textContent = order.orderStatus;
        });

        tableContainer.appendChild(table);
    } catch (error) {
        console.error('Error displaying orders:', error);
    }
};

displayOrders();

// ADD FOOD ITEM

const handleFoodItemSubmission = async(event: Event) => {
    event.preventDefault();
    const foodIname = (document.getElementById('name') as HTMLInputElement).value;
    const foodIdecription = (document.getElementById('description') as HTMLInputElement).value;
    const foodIprice = (document.getElementById('price') as HTMLInputElement).value;
    const foodIcategory = (document.getElementById('category') as HTMLInputElement).value;
    const foodIimage = (document.getElementById('imageUrl') as HTMLInputElement).value;
    await addFoodItemToBackend(foodIname, foodIdecription, foodIprice, foodIcategory, foodIimage);
}

async function addFoodItemToBackend(name: string, description: string, price: string, category: string, imageUrl: string) {
    const url = 'http://localhost:8000/api/menu/add';
    const data = {
        name: name,
        description: description,
        price: price,
        category: category,
        imageUrl: imageUrl
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log('Success:', responseData);
    } catch (error) {
        console.error('Error:', error);
    }
}
const form = document.getElementById('add-food-item-form');
if (form) {
    form.addEventListener('submit', handleFoodItemSubmission);
}
