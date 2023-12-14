import { MenuItem } from '../../interfaces/MenuItem';
import { getCurrentUser } from '../../utils/utils.js';
import { attachAddToCartListener, attachShoppingCartListener } from '../cart/cart.js';
import { deleteFoodItem } from '../user/admin.js';


/**
 * Fetches menu items from the server and displays them on the UI.
 */
const fetchAndDisplayMenu = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/menu');
        const menuItems: MenuItem[] = await response.json(); 
        renderMenu(menuItems);
        attachShoppingCartListener();
    } catch (error) {
        // console.error('Error fetching menu:', error);
    }
};

/**  
* Renders the menu items in the UI.
* @param {MenuItem[] | null} menuItems - Array of menu items to be displayed.
*/
const renderMenu = (menuItems: MenuItem[] | null) => {
    const menuContainer = document.querySelector('.menu-container');
    if (menuContainer) {
        menuContainer.innerHTML = '';
        menuItems?.forEach((item) => {
            const menuItemElement = createMenuItemElement(item);
            menuContainer.appendChild(menuItemElement);
        });
        attachAddToCartListener();
    }
};

/**
 * Creates a menu item element.
 * @param {MenuItem} menuItem - The menu item data.
 * @returns {HTMLElement} The created menu item element.
 */
const createMenuItemElement = (menuItem: MenuItem) => {
    const currentUser = getCurrentUser();
    const isAdmin = currentUser && currentUser.role === 'admin';

    const menuItemElement = document.createElement('div');
    menuItemElement.classList.add('box');

    const boxImg = document.createElement('div');
    boxImg.classList.add('box-img');
    const img = document.createElement('img');
    img.src = menuItem.imageUrl || './assets/images/menu-placeholder.png';
    img.alt = menuItem.name;
    boxImg.appendChild(img);

    const h2 = document.createElement('h2');
    h2.textContent = menuItem.name;

    const h3 = document.createElement('h3');
    h3.textContent = menuItem.description;

    const span = document.createElement('span');
    span.textContent = `${menuItem.price}€`;

    const button = document.createElement('i');
    if (isAdmin) {
        button.classList.add('bx', 'bx-trash', 'delete-item');
        button.addEventListener('click', () => deleteFoodItem(menuItem.id));
    } else {
        button.classList.add('bx', 'bx-cart-alt', 'add-to-cart');
    }

    menuItemElement.dataset.id = menuItem.id.toString();

    // Append all elements to menuItemElement
    menuItemElement.appendChild(boxImg);
    menuItemElement.appendChild(h2);
    menuItemElement.appendChild(h3);
    menuItemElement.appendChild(span);
    menuItemElement.appendChild(button);

    return menuItemElement;
};

// Event delegation for category buttons
const menuFilterContainer = document.querySelector('.menu-filter-btn') as HTMLElement;
/**
 * Event handler for menu category filter buttons.
 */
menuFilterContainer.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
        const buttonText = target.textContent?.trim() || ''; 

        if (buttonText === "Kaikki") { 
            fetchAndDisplayMenu();
        } else {
            try {
                const response = await fetch(`http://localhost:8000/api/menu/category/${buttonText}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const menuItems: MenuItem[] = await response.json();
                renderMenu(menuItems);
            } catch (error) {
                // console.error('Error fetching menu by category:', error);
            }
        }
    }
});

// Load the menu items when the window loads
window.addEventListener('load', fetchAndDisplayMenu);


export { fetchAndDisplayMenu, renderMenu, createMenuItemElement };
