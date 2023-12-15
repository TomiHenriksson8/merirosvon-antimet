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
    const response = await fetch(`ucad-server1.northeurope.cloudapp.azure.com/api/order/${user.id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }, );
    if (!response.ok) {
        // throw new Error(`HTTP error! Status: ${response.status}`);
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
    const orderHistoryContainer = document.querySelector('.order-history-container') as HTMLElement;
    const token = localStorage.getItem('token');
    if (!orderHistoryContainer) {
        // console.error('Order history container not found');
        return;
    }

    try {
        const response = await getOrderForOHistory();
        if (!response || !response.order) {
            // throw new Error('No orders found for the user');
        }
        const groupedOrders = groupOrders(response.order);
        orderHistoryContainer.innerHTML = '';
        Object.entries(groupedOrders).forEach(([orderId, orderDetails]) => {
            const orderDate = new Date(orderDetails[0].orderDate).toLocaleString('fi-FI', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              });
            let itemsHtml = orderDetails.map((item: DetailedOrder) => {
                const itemPrice = parseFloat(item.foodItemPrice).toFixed(2);
                return `
                    <div class="order-item">
                        <p>${item.foodItemName} - $${itemPrice} x ${item.quantity}</p>
                    </div>
                `;
            }).join('');
            
            let estimatedPickupTimeHtml = '';
            if (orderDetails[0].orderStatus === 'accepted') {
                estimatedPickupTimeHtml = `<p class="estimated-pickup-time">Arvioitu noutoaika:<br> <span id=o-status>${orderDetails[0].estimatedPickupTime} minuuttia</span></p>`;
            }
            orderHistoryContainer.innerHTML += `
                <div class="order-history-card">
                    <h3>Tilaus ID: ${orderId}</h3>
                    <p>Tilattu: ${orderDate}</p>
                    <p class="total-price">Hinta: ${parseFloat(orderDetails[0].totalPrice).toFixed(2)}€</p>
                    <p class="order-status ${orderDetails[0].orderStatus.toLowerCase()}">Tilauksen Tila: ${orderDetails[0].orderStatus}</p>
                    ${estimatedPickupTimeHtml}
                    <div class="items-list">
                        ${itemsHtml} 
                    </div>
                </div>`;
        });
    } catch (error) {
        if (!token) {
            // console.error('Error displaying orders:', error);
            orderHistoryContainer.innerHTML = `
            <p>Kirjaudu sisään nähdäksesi tilaushistorian.</p>`;
        } else {
            orderHistoryContainer.innerHTML = `
            <div class="empty-order-history">
                <img src="../../assets/images/order-h-empty.png" alt="Ei tilauksia" />
                <p>Tilaushistoriasi on tyhjä.</p>
            </div>
        `;
        }
        
        
    }
};


export { showPopup, closePopup, renderOrderHistory, getOrderForOHistory };
