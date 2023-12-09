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
            const popupOverlay = button.closest('.popup-overlay') as HTMLElement;
            if (popupOverlay) {
                popupOverlay.style.display = 'none';
                document.body.classList.remove('no-scroll');
            }
        });
    });
};


const showPopup = (popupContainerClass: string, title: string, message: string, imageSrc: string) => {
    // Close any open dialogs
    const dialogsToClose = ['profileModal', 'signUpModal', 'shoppingCart'];
    dialogsToClose.forEach(dialogId => {
        const dialogElement = document.getElementById(dialogId) as HTMLDialogElement | null;
        if (dialogElement) {
            dialogElement.close();
            dialogElement.style.display = 'none';
        }
    });

    // Show the popup
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



export { showPopup, closePopup, renderOrderHistory, getOrderForOHistory };
