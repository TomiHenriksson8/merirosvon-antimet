
import { CartItem } from "../../interfaces/MenuItem";
import { getCurrentUser } from "../../utils/utils.js";
import { showPopup } from "../order/order.js";


/**
 * Attaches click event listeners to "Add to Cart" buttons.
 */
const attachAddToCartListener = () => {
  console.log("Attaching add to cart listeners");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  console.log(`Found ${addToCartButtons.length} add-to-cart buttons`);
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      const foodItemElement = (event.target as HTMLElement).closest(".box");
      const foodItemId = foodItemElement?.getAttribute("data-id");
      if (foodItemId) {
        try {
          await addToCart(parseInt(foodItemId), 1);
        } catch (error) {
          console.error(error);
        }
      }
    });
  });
};

/**
 * Adds an item to the cart or updates its quantity if it already exists.
 * @async
 * @param {number} foodItemId - The ID of the food item to add to the cart.
 * @param {number} quantity - The quantity of the food item to add.
 * @throws {Error} Throws an error if the user is not logged in or other request issues occur.
 */
const addToCart = async (foodItemId: number, quantity: number): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    throw new Error("User is not logged in or user ID is not available.");
  }
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("User token is not available.");
  }
  try {
    const currentCartItems = await fetchCartItems();
    const existingItem = currentCartItems.find(item => item.id === foodItemId);
    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;
      await updateCartItemQuantity(foodItemId, updatedQuantity);
    } else {
      const response = await fetch("http://localhost:8000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: currentUser.id,
          foodItemId: foodItemId,
          quantity: quantity,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    const updatedCartItems = await fetchCartItems();
    renderCartItems(updatedCartItems);
    updateCartTotalInUI();
  } catch (error) {
    console.error("Error processing cart item:", error);
  }
};

/**
 * Adds to or updates the quantity of a cart item.
 * @async
 * @param {number} foodItemId - The ID of the food item.
 * @param {number} quantity - The new quantity to be set.
 * @throws {Error} Throws an error if the user is not logged in or other request issues occur.
 */
const addOrUpdateCartItemQuantity = async (foodItemId: number, quantity: number): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id ) {
    throw new Error('User is not logged in or user ID is not available.')
  }
  try {
    const currentCartItem = await fetchCartItems();
    const findExitingItem = currentCartItem.find(item => item.id === foodItemId);
    if (findExitingItem) {
      const newQuantity = findExitingItem.quantity + quantity;
      await updateCartItemQuantity(foodItemId, newQuantity); 
      const updatedCartItems = await fetchCartItems();
      renderCartItems(updatedCartItems);
      updateCartTotalInUI();   
    } else {
      await addToCart(foodItemId, quantity);
    }
  } catch (error) {
    console.error('Error processing cart item:', error);
  }
};

/**
 * Decreases the quantity of a cart item or removes it from the cart.
 * @async
 * @param {number} foodItemId - The ID of the food item.
 * @param {number} quantity - The amount to decrease the quantity by.
 * @throws {Error} Throws an error if the user is not logged in or other request issues occur.
 */
const decreaseOrRemoveCartItem = async (foodItemId: number, quantity: number): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    throw new Error('User is not logged in or user ID is not available');
  }
  try {
    const currentCartItem = await fetchCartItems();
    const findExitingItem = currentCartItem.find(item => item.id === foodItemId);
    if (findExitingItem) {
      const newQuantity = findExitingItem.quantity - quantity;
      if (newQuantity < 1) {
        await deleteCartItem(foodItemId.toString());
      } else {
        await updateCartItemQuantity(foodItemId, newQuantity);
      }
      const updatedCartItems = await fetchCartItems();
      renderCartItems(updatedCartItems);
      updateCartTotalInUI();
    } else {
      console.error('Item not found in cart:', foodItemId);
    }
  } catch (error) {
    console.error('Error processing cart item:', error);
  }
};

/**
 * Updates the quantity of a specific item in the cart.
 * @async
 * @param {number} foodItemId - The ID of the food item.
 * @param {number} newQuantity - The new quantity of the item.
 * @throws {Error} Throws an error if the user is not logged in or other request issues occur.
 */
const updateCartItemQuantity = async (foodItemId: number, newQuantity: number): Promise<void> => {
  const currentUser = getCurrentUser();
  const token = localStorage.getItem('token');
  if (!currentUser || !currentUser.id || !token) {
    throw new Error('User is not logged in or user ID/token is not available.');
  }
  try {
    const response = await fetch('http://localhost:8000/api/cart/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: currentUser.id,
        foodItemId: foodItemId,
        newQuantity: newQuantity 
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error', error)
  }
};

/**
 * Fetches the current items in the user's cart.
 * @async
 * @returns {Promise<CartItem[]>} A promise that resolves to an array of cart items.
 * @throws {Error} Throws an error if the user is not logged in or other request issues occur.
 */
const fetchCartItems = async (): Promise<CartItem[]> => {
  const currentUser = getCurrentUser();
  const token = localStorage.getItem('token');
  if (!currentUser || !currentUser.id || !token) {
    throw new Error("User is not logged in or token is not available.");
  }

  const response = await fetch(`http://localhost:8000/api/cart/${currentUser.id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error(`Could not fetch cart items, received status ${response.status}`);
  }
  const cartItems: CartItem[] = await response.json();
  return cartItems;
};

/**
 * Updates the total cost display in the shopping cart UI.
 */
const updateCartTotalInUI = async () => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    console.error("User is not logged in.");
    return;
  }
  const total = await fetchCartTotal(currentUser.id);
  const cartTotalElement = document.getElementById('cart-total');
  if (cartTotalElement) {
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
  }
};

/**
 * Fetches the total cost of items in the user's cart.
 * @async
 * @param {number} userId - The ID of the user whose cart total is being fetched.
 * @returns {Promise<number>} The total cost of the cart items.
 * @throws {Error} Throws an error if the user token is not available or other request issues occur.
 */
const fetchCartTotal = async (userId: number): Promise<number> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error("User token is not available.");
  }
  try {
    const response = await fetch(`http://localhost:8000/api/cart/total/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return parseFloat(data.total);
  } catch (error) {
    console.error('Error fetching cart total:', error);
    return 0;
  }
};

/**
 * Renders the cart items in the shopping cart UI.
 * @param {CartItem[]} cartItems - The cart items to render.
 * @throws {Error} Throws an error if the cart container element is not found.
 */
const renderCartItems = (cartItems: CartItem[]): void => {
  const cartContainer = document.querySelector(".cart-items");
  if (!cartContainer) {
    console.error("Cart container element not found.");
    return;
  }
  cartContainer.innerHTML = "";
  cartItems.forEach((item) => {
    const cartItemHtml = `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>${item.description}</p>
          <p>
            <button class="quantity-btn minus-btn" data-id="${item.id}" aria-label="Decrease quantity">
              <i class='bx bxs-minus-circle'></i>
            </button>
            ${item.quantity}
            <button class="quantity-btn plus-btn" data-id="${item.id}" aria-label="Increase quantity">
              <i class='bx bxs-plus-circle'></i>
            </button>
          </p>
          <p>Price: $${item.price}</p>
        </div>
        <button class="delete-cart-item" data-id="${item.id}"><span>X</span></button>
      </div>
    `;
    cartContainer.innerHTML += cartItemHtml;
  });
  attachQuantityEventListeners();
  attachDeleteEventListeners();
};

/**
 * Attaches event listeners to the quantity buttons of each cart item.
 */
const attachQuantityEventListeners = () => {
  const minusButtons = document.querySelectorAll('.minus-btn'); 
  const plusButtons = document.querySelectorAll('.plus-btn');
  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const foodItemIds = button.getAttribute('data-id');
      if (foodItemIds) {
        const foodItemId = parseInt(foodItemIds, 10);
        if (!isNaN(foodItemId)) {
          decreaseOrRemoveCartItem(foodItemId, 1);
        } else {
          console.error('Invalid foodItemId:', foodItemIds);
        }
      } else {
        console.error('Could not get data-id attribute from the button');
      }
    });
  });
  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const foodItemIds = button.getAttribute('data-id');
      if (foodItemIds) {
        const foodItemId = parseInt(foodItemIds, 10);
        if (!isNaN(foodItemId)) {
          addOrUpdateCartItemQuantity(foodItemId, 1);
        } else {
          console.error('Invalid foodItemId:', foodItemIds);
        }
      } else {
        console.error('Could not get data-id attribute from the button');
      }
    });
  });
};

/**
 * Attaches event listeners to the delete buttons of each cart item.
 */
const attachDeleteEventListeners = () => {
  const deleteButtons = document.querySelectorAll(".delete-cart-item");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target && event.target instanceof HTMLElement) {
        const itemId = event.target.getAttribute("data-id");
        if (itemId) {
          deleteCartItem(itemId);
        }
      }
    });
  });
};

/**
 * Deletes a cart item from the user's cart.
 * @async
 * @param {string} itemId - The ID of the cart item to delete.
 * @throws {Error} Throws an error if the user is not logged in or other request issues occur.
 */
const deleteCartItem = async (itemId: string): Promise<void> => {
  const currentUser = getCurrentUser();
  const token = localStorage.getItem('token');
  if (!currentUser || !currentUser.id || !token) {
    console.error("User is not logged in or user ID/token is not available.");
    return;
  }
  try {
    const response = await fetch(`http://localhost:8000/api/cart/remove/${currentUser.id}/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ userId: currentUser.id, foodItemId: itemId }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log(`Item ${itemId} deleted successfully from the cart.`);
    const updatedCartItems = await fetchCartItems();
    await updateCartTotalInUI();
    renderCartItems(updatedCartItems);
  } catch (error) {
    console.error("Error deleting item from cart:", error);
  }
};

/**
 * Attaches click event listeners to the shopping cart icon.
 */
const attachShoppingCartListener = () => {
  const shoppingCartButton = document.getElementById("cart-icon");
  const shoppingCartDialog = document.getElementById(
    "shoppingCart"
  ) as HTMLDialogElement | null;
  const closeCartButton = document.querySelector(
    ".close-cart"
  ) as HTMLButtonElement | null;
  if (shoppingCartButton && shoppingCartDialog && closeCartButton) {
    shoppingCartButton.addEventListener("click", async () => {
      console.log("Cart icon clicked");
      try {
        const cartItems = await fetchCartItems();
        renderCartItems(cartItems);
        await updateCartTotalInUI();
        shoppingCartDialog.showModal();
      } catch (error) {
        console.error("Error fetching or rendering cart items:", error);
      }
    });
    closeCartButton.addEventListener("click", () => {
      shoppingCartDialog.close();
      document.body.classList.remove('no-scroll');
      shoppingCartDialog.style.display = "none";
    });
  } else {
    console.error(
      "One or more elements are missing: shopping cart button, dialog, or close button"
    );
  }
};

/**
 * Attaches click event listeners to the checkout button.
 */
document.addEventListener("DOMContentLoaded", () => {
  const orderButton = document.querySelector('.checkout');
  orderButton?.addEventListener('click', async () => {
    const user = getCurrentUser();
    const token = localStorage.getItem('token');
    if (user) {
      try {
        const response = await fetch('http://localhost:8000/api/order/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Auhtorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.id
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        showPopup('popup-ok-o-container', 'Order Placed Successfully!', 'Thank you for your order! We are currently processing it and will send you a confirmation email shortly. You can view your order details and status in your account.', './assets/images/popupok.png')
      } catch (error) {
        console.error('Error creating order:', error);
        showPopup('popup-fail-o-container', 'Something Went Wrong', "We''re sorry, but there was a problem processing your order. Please check your information and try again. If the problem persists, please contact our support team.", './assets/images/popupfail.png');
      }
    }
  });
});


export { attachAddToCartListener, attachShoppingCartListener };
