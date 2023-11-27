import { MenuItem } from '../../interfaces/MenuItem';
import { attachAddToCartListener, attachShoppingCartListener } from '../cart/cart.js';

const fetchAndDisplayMenu = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/menu');
      const menuItems: MenuItem[] = await response.json(); 
      renderMenu(menuItems);
      attachShoppingCartListener();
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };
  
document.querySelectorAll('.menu-filter-btn button').forEach((button) => {
  button.addEventListener('click', async () => {
    if (button.textContent) {
      const buttonText = button.textContent.trim();

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
        console.error('Error fetching menu by category:', error);
      }
    }
    }
    
  });
});

  


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
  
  const createMenuItemElement = (menuItem: MenuItem) => {
    const menuItemElement = document.createElement('div');
    menuItemElement.classList.add('box');
    const boxImg = document.createElement('div');
    boxImg.classList.add('box-img');
    const img = document.createElement('img');
    img.src = menuItem.imageUrl || './assets/images/menu-placeholder.png';
    img.alt = '';
    boxImg.appendChild(img);
  
    const h2 = document.createElement('h2');
    h2.textContent = menuItem.name;
  
    const h3 = document.createElement('h3');
    h3.textContent = menuItem.description;
  
    const span = document.createElement('span');
    span.textContent = menuItem.price + '€';
  
    const i = document.createElement('i');
    i.classList.add('bx', 'bx-cart-alt', 'add-to-cart');
    
    menuItemElement.dataset.id = menuItem.id.toString();

    
    menuItemElement.appendChild(boxImg);
    menuItemElement.appendChild(h2);
    menuItemElement.appendChild(h3);
    menuItemElement.appendChild(span);
    menuItemElement.appendChild(i);
    
    return menuItemElement;
  };
  
  window.addEventListener('load', fetchAndDisplayMenu);

  export {fetchAndDisplayMenu, renderMenu, createMenuItemElement}