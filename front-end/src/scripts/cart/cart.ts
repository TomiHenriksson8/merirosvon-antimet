// cart.ts

import { MenuItem } from "../../interfaces/MenuItem";
import { CartItem } from "../../interfaces/MenuItem";
import { getCurrentUser } from "../../utils/utils.js";
import { popUpOk, popUpFail, closePopup } from "../order/order.js";

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

const addToCart = async (
  foodItemId: number,
  quantity: number
): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    throw new Error("User is not logged in or user ID is not available.");
  }
  try {
    const response = await fetch("http://localhost:8000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // authentication tokens if necessary
      },
      body: JSON.stringify({
        userId: currentUser.id,
        foodItemId: foodItemId,
        quantity: quantity,
      }),
    });
    console.log(
      `Sent data for user ${currentUser.id}, food item ${foodItemId}, quantity ${quantity}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    // in here
    console.log("Item added to cart successfully.");
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

const fetchCartItems = async (): Promise<CartItem[]> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    throw new Error("User is not logged in.");
  }
  const response = await fetch(
    `http://localhost:8000/api/cart/${currentUser.id}`
  );
  if (!response.ok) {
    throw new Error(
      `Could not fetch cart items, received status ${response.status}`
    );
  }

  const cartItems: CartItem[] = await response.json();
  return cartItems;
};

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


const fetchCartTotal = async (userId: number): Promise<number> => {
  try {
    const response = await fetch(`http://localhost:8000/api/cart/total/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return parseFloat(data.total);
  } catch (error) {
    console.error('Error fetching cart total:', error);
    return 0; // Return 0 or handle error appropriately
  }
};

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
                    <!-- Minus Button -->
                    <button class="quantity-btn" id="minus-q" aria-label="Decrease quantity">
                      <i class='bx bxs-minus-circle'></i>
                    </button>
                    
                    ${item.quantity}
                    
                    <!-- Plus Button -->
                    <button class="quantity-btn" id="plus-q" aria-label="Increase quantity">
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

  attachDeleteEventListeners();
};

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

const deleteCartItem = async (itemId: string): Promise<void> => {
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    console.error("User is not logged in or user ID is not available.");
    return;
  }
  try {
    const response = await fetch(
      `http://localhost:8000/api/cart/remove/${currentUser.id}/${itemId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id, foodItemId: itemId }),
      }
    );
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

document.addEventListener("DOMContentLoaded", () => {
  const orderButton = document.querySelector('.checkout');
  orderButton?.addEventListener('click', async () => {
    const user = getCurrentUser();

    if (user) {
      try {
        const response = await fetch('http://localhost:8000/api/order/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id
          })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        popUpOk();
        
      } catch (error) {
        console.error('Error creating order:', error);
        popUpFail();
        
      }
    }
  });
});



export { attachAddToCartListener, attachShoppingCartListener };
