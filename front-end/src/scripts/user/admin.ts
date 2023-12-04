import { getCurrentUser } from '../../utils/utils.js';
import { DetailedOrder, OrdersResponse, GroupedOrders } from '../../interfaces/Order.js';
import { User } from '../../interfaces/User.js';

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
        throw error;
    }
};

const displayOrders = async () => {
    try {
        const ordersData = await getOrders();
        if (!ordersData || ordersData.orders.length === 0) {
            console.error('Failed to retrieve orders data');
            return;
        }

        const tableContainer = document.getElementById('orders-table-container') as HTMLDivElement;
        if (!tableContainer) {
            console.error('Table container not found');
            return;
        }

        const table = document.createElement('table');
        const headerRow = table.insertRow();
        ['Order ID', 'User Info', 'Total Price', 'Order Date', 'Order Status', 'Item Details'].forEach(text => {
            const cell = headerRow.insertCell();
            cell.textContent = text;
        });

        // Group orders by orderId
        const orderGroups: GroupedOrders = ordersData.orders.reduce((acc: GroupedOrders, order: DetailedOrder) => {
            acc[order.orderId] = acc[order.orderId] || [];
            acc[order.orderId].push(order);
            return acc;
        }, {});

        Object.entries(orderGroups).forEach(([orderId, orders]) => {
            const row = table.insertRow();
            row.insertCell().textContent = orderId;

            const userInfoLink = document.createElement('a');
            userInfoLink.href = '#';
            userInfoLink.textContent = `User ${orders[0].userId}`;
            userInfoLink.addEventListener('click', (event) => {
            event.preventDefault();
            displayUserInfo(orders[0].userId);
            });
            const userInfoCell = row.insertCell();
        userInfoCell.appendChild(userInfoLink);

        row.insertCell().textContent = orders[0].totalPrice.toString();
        row.insertCell().textContent = orders[0].orderDate;

        const statusDropdown = document.createElement('select');
        ['completed', 'pending', 'cancelled'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            option.selected = orders[0].orderStatus === status;
            statusDropdown.appendChild(option);
        });
        statusDropdown.addEventListener('change', (event: Event) => {
            const target = event.target as HTMLSelectElement;
            updateOrderStatus(parseInt(orderId), target.value);
        });
        const statusCell = row.insertCell();
        statusCell.appendChild(statusDropdown);

        // Concatenate item details
        const itemDetails = orders.map((item: DetailedOrder) => `${item.foodItemName} (x${item.quantity}) - ${item.foodItemPrice} each`).join(', ');
        row.insertCell().textContent = itemDetails;
});

        tableContainer.appendChild(table);
    } catch (error) {
        console.error('Error displaying orders:', error);
    }
};

displayOrders();





async function updateOrderStatus(orderId: number, newStatus: string) {
    console.log(`Update status for order ${orderId} to ${newStatus}`);

    // The URL for the backend endpoint
    const url = `http://localhost:8000/api/order/status/${orderId}`; // Replace with your actual backend URL

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newStatus: newStatus })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Update successful:', responseData);
    } catch (error) {
        console.error('Error updating order status:', error);
    }
}

/// show user info based on user id on table

const fetchUserInfoById = async (userId: number): Promise<User | null> => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userInfo: User = await response.json();
        return userInfo;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};

const displayUserInfo = async (userId: number) => {
    const userInfo = await fetchUserInfoById(userId);
    if (userInfo) {
        // Display user information in your preferred way
        // For example, you might use a modal or an alert for simplicity
        alert(`Name: ${userInfo.username}\nEmail: ${userInfo.email}`);
    }
};



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


