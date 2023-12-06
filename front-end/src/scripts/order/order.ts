import { getCurrentUser } from "../../utils/utils.js";
import { DetailedOrder, OrdersResponse, GroupedOrders } from "../../interfaces/Order.js";

const closePopup = (popupContainerClass: string) => {
    const popupOverlay = document.querySelector(`.${popupContainerClass}`) as HTMLElement;
    if (popupOverlay) {
        popupOverlay.style.display = 'none';
    }
};

const attachCloseButtonListeners = () => {
    const closeButtons = document.querySelectorAll('.close-popup');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.closest('.popup-ok-container')) {
                closePopup('popup-ok-container');
            } else if (button.closest('.popup-fail-container')) {
                closePopup('popup-fail-container');
            }
        });
    });
};

const popUpOk = () => {
    const cartDialog = document.getElementById('shoppingCart') as HTMLDialogElement;
    const popupOverlay = document.querySelector('.popup-ok-container') as HTMLElement;
    if (popupOverlay && cartDialog) {
        cartDialog.close();
        popupOverlay.style.display = 'flex';
        const popupOk = document.querySelector('.popup-ok') as HTMLElement;
        popupOk.style.transform = 'scale(1)';
        attachCloseButtonListeners();
    }
};

const popUpFail = () => {
    const popupOverlay = document.querySelector('.popup-fail-container') as HTMLElement;
    const cartDialog = document.getElementById('shoppingCart') as HTMLDialogElement;
    if (popupOverlay && cartDialog) {
        cartDialog.close();
        popupOverlay.style.display = 'flex';
        const popupFail = document.querySelector('.popup-fail') as HTMLElement;
        popupFail.style.transform = 'scale(1)';
        attachCloseButtonListeners();
    }
};

const getOrderForOHistory = async () => {
    const user = await getCurrentUser();
    if (!user || !user.id) {
        throw new Error('User not found');
    }
    const response = await fetch(`http://localhost:8000/api/order/${user.id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    };
    const orderHistory = await response.json();
    console.log(orderHistory);
    return orderHistory;
};

const groupOrders = (order: DetailedOrder[]): GroupedOrders => {
    return order.reduce((grouped, order) => {
      (grouped[order.orderId] = grouped[order.orderId] || []).push(order);
      return grouped;
    }, {} as GroupedOrders);
  };
  
  const renderOrderHistory = async () => {
    try {
        const response = await getOrderForOHistory();
        // Check if the response has the 'order' property and it's an array
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
                    // Convert string to number before calling toFixed
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
                        <p>Total price: $${parseFloat(orderDetails[0].totalPrice).toFixed(2)}</p>
                        <p>Order status: ${orderDetails[0].orderStatus}</p>
                        ${itemsHtml}
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error('Error displaying orders:', error);
    }
};



export { popUpOk, popUpFail, closePopup, renderOrderHistory, getOrderForOHistory };
