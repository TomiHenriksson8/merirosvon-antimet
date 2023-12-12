import { getCurrentUser } from "../../utils/utils.js";
import { DetailedOrder, OrdersResponse, GroupedOrders } from "../../interfaces/Order.js";

/**
 * Closes the specified popup.
 * @param {string} popupContainerClass - The class of the popup container to close.
 */
const closePopup = (popupContainerClass: string) => {
    const popupOverlay = document.querySelector(`.${popupContainerClass}`) as HTMLElement;
    if (popupOverlay) {
        popupOverlay.style.display = 'none';
    }
};

/**
 * Attaches event listeners to close popup buttons.
 */
const attachCloseButtonListeners = () => {
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popupOverlay = button.closest('.popup-overlay') as HTMLElement;
            if (popupOverlay) {
                popupOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });
};

/**
 * Displays a popup with the specified title, message, and image.
 * @param {string} popupContainerClass - The class of the popup container to display.
 * @param {string} title - The title of the popup.
 * @param {string} message - The message in the popup.
 * @param {string} imageSrc - The source URL of the image in the popup.
 */
const showPopup = (popupContainerClass: string, title: string, message: string, imageSrc: string) => {
    const dialogsToClose = ['profileModal', 'signUpModal', 'shoppingCart'];
    dialogsToClose.forEach(dialogId => {
        const dialogElement = document.getElementById(dialogId) as HTMLDialogElement | null;
        if (dialogElement) {
            dialogElement.close();
            dialogElement.style.display = 'none';
        }
    });
    const popupOverlay = document.querySelector(`.${popupContainerClass}`) as HTMLElement | null;
    if (popupOverlay) {
        const popupTitle = popupOverlay.querySelector('h3') as HTMLElement | null;
        const popupMessage = popupOverlay.querySelector('p') as HTMLElement | null;
        const popupImage = popupOverlay.querySelector('img') as HTMLImageElement | null;
        if (popupTitle && popupMessage && popupImage) {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popupImage.src = imageSrc;
        }
        document.body.classList.add('no-scroll');
        popupOverlay.style.display = 'flex';
        attachCloseButtonListeners();
    }
};

/**
 * Fetches order history for the current user.
 * @returns {Promise<OrdersResponse>} - The order history.
 */
const getOrderForOHistory = async () => {
    const user = await getCurrentUser();
    const token = localStorage.getItem('token');
    if (!user || !user.id || !token) {
        throw new Error('User not found or token not set');
    }
    const response = await fetch(`http://localhost:8000/api/order/${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }, );
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    };
    const orderHistory = await response.json();
    // console.log(orderHistory);
    return orderHistory;
};

/**
 * Groups detailed orders by order ID.
 * @param {DetailedOrder[]} order - Array of detailed orders.
 * @returns {GroupedOrders} - The grouped orders.
 */
const groupOrders = (order: DetailedOrder[]): GroupedOrders => {
    return order.reduce((grouped, order) => {
      (grouped[order.orderId] = grouped[order.orderId] || []).push(order);
      return grouped;
    }, {} as GroupedOrders);
  };
  
  /**
 * Renders the order history in the UI.
 */
  const renderOrderHistory = async () => {
    try {
        const response = await getOrderForOHistory();
        if (!response || !Array.isArray(response.order)) {
            throw new Error('No orders found or the data is not in the expected format.');
        }
        const groupedOrders = groupOrders(response.order);
        const orderHistoryContainer = document.querySelector('.order-history-container') as HTMLElement;
        if (orderHistoryContainer) {
            orderHistoryContainer.innerHTML = '';
            Object.entries(groupedOrders).forEach(([orderId, orderDetails]) => {
                const orderDate = new Date(orderDetails[0].orderDate).toLocaleDateString();
                let itemsHtml = orderDetails.map((item: DetailedOrder) => {
                    const itemPrice = parseFloat(item.foodItemPrice).toFixed(2);
                    return `
                        <div class="order-item">
                            <p>${item.foodItemName} - $${itemPrice} x ${item.quantity}</p>
                        </div>
                    `;
                }).join('');
                orderHistoryContainer.innerHTML += `
                    <div class="order-history-card">
                    <h3>Order ID: ${orderId}</h3>
                    <p>Order date: ${orderDate}</p>
                    <p class="total-price">Total price: $${parseFloat(orderDetails[0].totalPrice).toFixed(2)}</p>
                    <p class="order-status ${orderDetails[0].orderStatus.toLowerCase()}">Order status: ${orderDetails[0].orderStatus}</p>
                    <div class="items-list">
                        ${itemsHtml} <!-- Ensure this variable contains HTML with item details -->
                    </div>
                </div>`;
            });
        }
    } catch (error) {
        // console.error('Error displaying orders:', error);
    }
};


export { showPopup, closePopup, renderOrderHistory, getOrderForOHistory };
