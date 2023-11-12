import { MenuItem } from '../../interfaces/MenuItem';


const fetchAndDisplayMenu = async () => {
    try {
      // Fetch the menu items from the backend using the appropriate endpoint
      const response = await fetch('http://localhost:8000/api/menu'); // Adjust the URL accordingly
      const menuItems: MenuItem[] = await response.json(); // Specify the type for menuItems
      console.log('test3')
      // Display the menu on the webpage
      renderMenu(menuItems);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };
  
  // Function to render the menu on the webpage
  const renderMenu = (menuItems: MenuItem[] | null) => {
    // Access the DOM elements where you want to display the menu
    const menuContainer = document.querySelector('.menu-container');
    console.log('test1')
    // Check if menuContainer is not null
    if (menuContainer) {
      // Clear previous content
      menuContainer.innerHTML = '';
  
      // Iterate over the menu items and create HTML elements to display them
      menuItems?.forEach((item) => {
        const menuItemElement = createMenuItemElement(item);
        menuContainer.appendChild(menuItemElement);
      });
    }
  };
  
  // Function to create an HTML element for a menu item
  const createMenuItemElement = (menuItem: MenuItem) => {
    // Create and customize HTML elements to represent a menu item
    const menuItemElement = document.createElement('div');
    menuItemElement.classList.add('box');
    console.log('test2')
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
    i.classList.add('bx', 'bx-cart-alt');
  
    // Append elements to the menu item container
    menuItemElement.appendChild(boxImg);
    menuItemElement.appendChild(h2);
    menuItemElement.appendChild(h3);
    menuItemElement.appendChild(span);
    menuItemElement.appendChild(i);
  
    return menuItemElement;
  };
  
  // Call the fetchAndDisplayMenu function when the page loads
  window.addEventListener('load', fetchAndDisplayMenu);
  