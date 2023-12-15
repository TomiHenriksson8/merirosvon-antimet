import { getCurrentUser } from '../../utils/utils.js';
import { DetailedOrder, OrdersResponse, GroupedOrders } from '../../interfaces/Order.js';
import { User } from '../../interfaces/User.js';

const token = localStorage.getItem('token');
const user = getCurrentUser();

/**
 * Redirects to the appropriate page based on the user's role.
 */
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
    localStorage.removeItem('token');
    console.log("Panel exited successfully");
    redirectToAppropriatePage();
});

/**
 * Displays the total number of users.
 */
const showAmountOfUsers = async () => {
    const url = 'ucad-server1.northeurope.cloudapp.azure.com/api/users/latest/id';
    const token = localStorage.getItem('token');
    if (!token) {
        // console.error("No token found");
        return;
    }
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const latestUserId = responseData.latestUserId;
        const amountOfUsersElement = document.getElementById('users-box');
        if (amountOfUsersElement) {
            amountOfUsersElement.innerHTML = `Total Users: ${latestUserId}`;
        }
    } catch (error) {
        // console.error('Error:', error);
    }
};


if (token && user?.role === 'admin') {
    showAmountOfUsers();
}

/**
 * Displays the total number of orders.
 */
const showAmountOfOrders = async () => {
    const url = 'ucad-server1.northeurope.cloudapp.azure.com/api/order/latest/id';
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const latestOrderId = responseData.latestOrderId;
        const amountOfOrdersElement = document.getElementById('orders-box');
        if (amountOfOrdersElement) {
            amountOfOrdersElement.innerHTML = `Total Orders: ${latestOrderId}`;
        }
    } catch (error) {
        // console.error('Error:', error);
    }
};

if (token && user?.role === 'admin') {
    showAmountOfOrders();
};


const showAmountOfFoodItems = async () => {
    const url = 'ucad-server1.northeurope.cloudapp.azure.com/api/menu/count';
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        const FoodItemsCount = responseData.itemCount;
        const amountOfFoodItemsElement = document.getElementById('food-items-box');
        if (amountOfFoodItemsElement) {
            amountOfFoodItemsElement.innerHTML = `Food Items Count: ${FoodItemsCount}`;
        }
    } catch (error) {
        // console.error('Error:', error);
    }
};

showAmountOfFoodItems();

// ORDER LIST

/**
 * Fetches all orders.
 * @returns {Promise<OrdersResponse>} A promise that resolves to the orders response.
 */
const getOrders = async (): Promise<OrdersResponse> => {
    const url = 'ucad-server1.northeurope.cloudapp.azure.com/api/order/all';
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData: OrdersResponse = await response.json();
        return responseData;
    } catch (error) {
        // console.error('Error:', error);
        throw error;
    }
};

/**
 * Displays orders in a table format.
 */
const displayOrders = async () => {
    try {
        const ordersData = await getOrders();
        if (!ordersData || ordersData.orders.length === 0) {
            // console.error('Failed to retrieve orders data');
            return;
        }

        const tableContainer = document.getElementById('orders-table-container') as HTMLDivElement;
        if (!tableContainer) {
            // console.error('Table container not found');
            return;
        }

        const table = document.createElement('table');
        const headerRow = table.insertRow();
        ['Order ID', 'User Info', 'Total Price', 'Order Date', 'Order Status', 'Estimated PT', 'Item Details'].forEach(text => {
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
        const isoDate = orders[0].orderDate; 

        const dateObject = new Date(isoDate);

        const formattedDate = dateObject.toLocaleDateString('fi-FI', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });


row.insertCell().textContent = formattedDate;

        const statusDropdown = document.createElement('select');
        ['completed', 'pending', 'accepted', 'cancelled'].forEach(status => {
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
        // make and drop down whit esitmated time
        const estimatedTimeDropdown = document.createElement('select');
            [5, 10, 15, 20, 25, 30, 45, 55].forEach(time => {
                const option = document.createElement('option');
                option.value = time.toString();
                option.textContent = `${time} minuuttia`;
                option.selected = orders[0].estimatedPickupTime === time;
                estimatedTimeDropdown.appendChild(option);
            });
            estimatedTimeDropdown.addEventListener('change', (event) => {
                const target = event.target as HTMLSelectElement;
                updateEstimatedPickupTime(parseInt(orderId), parseInt(target.value));
            });
            const estimatedTimeCell = row.insertCell();
            estimatedTimeCell.appendChild(estimatedTimeDropdown);
        const itemDetails = orders.map((item: DetailedOrder) => `${item.foodItemName} (x${item.quantity}) - ${item.foodItemPrice} each`).join(', ');
        row.insertCell().textContent = itemDetails;
});
        tableContainer.appendChild(table);
    } catch (error) {
        //console.error('Error displaying orders:', error);
    }
};

if (token && user?.role === 'admin') {
    displayOrders(); 
}

/**
 * Updates the estimated pickup time of an order.
 * @param {number} orderId - The ID of the order to update.
 * @param {number} estimatedPickupTime - The new estimated pickup time.
 * @returns {Promise<void>} A promise that resolves when the estimated pickup time is updated.
 * @throws {Error} An error is thrown if the estimated pickup time fails to update.
 */
const updateEstimatedPickupTime = async (orderId: number, estimatedPickupTime: number) => {
    const url = `ucad-server1.northeurope.cloudapp.azure.com/api/order/estimatedpt/${orderId}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ estimatedPickupTime })
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        // console.log('Update successful:', responseData);
    } catch (error) {
        // console.error('Error updating estimated pickup time:', error);
    }
};

/**
 * Updates the status of an order.
 * @param {number} orderId - The ID of the order to update.
 * @param {string} newStatus - The new status of the order.
 */
async function updateOrderStatus(orderId: number, newStatus: string) {
    console.log(`Update status for order ${orderId} to ${newStatus}`);
    const url = `ucad-server1.northeurope.cloudapp.azure.com/api/order/status/${orderId}`;
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newStatus })
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        // console.log('Update successful:', responseData);
    } catch (error) {
        // console.error('Error updating order status:', error);
    }
}

/**
 * Fetches user information by user ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<User | null>} A promise that resolves to the user information.
 */
const fetchUserInfoById = async (userId: number): Promise<User | null> => {
    const token = localStorage.getItem('token'); 
    try {
        const response = await fetch(`ucad-server1.northeurope.cloudapp.azure.com/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const userInfo: User = await response.json();
        return userInfo;
    } catch (error) {
        // console.error("Error fetching user info:", error);
        return null;
    }
};

/**
 * Displays information for a specific user.
 * @param {number} userId - The ID of the user to display information for.
 */
const displayUserInfo = async (userId: number) => {
    const userInfo = await fetchUserInfoById(userId);
    if (userInfo) {
        alert(`Name: ${userInfo.username}\nEmail: ${userInfo.email}`);
    }
};

// ADD FOOD ITEM

/**
 * Handles the submission of a new food item.
 * @param {Event} event - The event object.
 */
const handleFoodItemSubmission = async(event: Event) => {
    event.preventDefault();
    const foodIname = (document.getElementById('name') as HTMLInputElement).value;
    const foodIdecription = (document.getElementById('description') as HTMLInputElement).value;
    const foodIprice = (document.getElementById('price') as HTMLInputElement).value;
    const foodIcategory = (document.getElementById('category') as HTMLInputElement).value;
    const foodIimage = (document.getElementById('imageUrl') as HTMLInputElement).value;
    await addFoodItemToBackend(foodIname, foodIdecription, foodIprice, foodIcategory, foodIimage);
}

/**
 * Adds a new food item to the backend.
 * @param {string} name - The name of the food item.
 * @param {string} description - The description of the food item.
 * @param {string} price - The price of the food item.
 * @param {string} category - The category of the food item.
 * @param {string} imageUrl - The image URL of the food item.
 */
async function addFoodItemToBackend(name: string, description: string, price: string, category: string, imageUrl: string) {
    const url = 'ucad-server1.northeurope.cloudapp.azure.com/api/menu/add';
    const token = localStorage.getItem('token');
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
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            // throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        // console.log('Success:', responseData);
    } catch (error) {
        // console.error('Error:', error);
    }
}
const form = document.getElementById('add-food-item-form');
if (form) {
    form.addEventListener('submit', handleFoodItemSubmission);
}

/**
 * Deletes a food item.
 * @param {number} foodItemId - The ID of the food item to delete.
 * @returns {Promise<void>} A promise that resolves when the food item is deleted.
 * @throws {Error} An error is thrown if the food item fails to delete.
 */
const deleteFoodItem = async (foodItemId: number) => {
    const url = `ucad-server1.northeurope.cloudapp.azure.com/api/menu/${foodItemId}/delete`;
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("No token found");
        return;
    }
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            alert("Food item deleted successfully");
            // update ui here  :/
        } else {
            throw new Error(`Failed to delete food item: ${response.status}`);
        }
    } catch (error) {
        // console.error('Error:', error);
    }
};

export { deleteFoodItem };
