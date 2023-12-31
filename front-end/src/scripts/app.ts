import { getCurrentUser } from '../utils/utils.js';
import { renderOrderHistory } from './order/order.js';

/**
 * Handles functionality related to the profile and order history links in the UI.
 */

// login modal
const profileLink = document.getElementById('profileLink') as HTMLElement;
const orderHistoryLink = document.getElementById('orderHistoryLink') as HTMLElement;

const orderHistoryContainer = document.querySelector('.order-history-container') as HTMLElement;
const profileContainer = document.querySelector('.profile-container') as HTMLElement;

orderHistoryLink.addEventListener('click', () => {
    renderOrderHistory();
    orderHistoryContainer.style.display = "block";
    profileContainer.style.display = "none";
});

profileLink.addEventListener('click', () => {
    orderHistoryContainer.style.display = "none"; 
    profileContainer.style.display = "block";
});

/**
 * Manages the display and interaction with the profile modal.
 */
const profileModal = document.getElementById("profileModal") as HTMLDialogElement;
const profileIconLink = document.getElementById("profile-icon") as HTMLAnchorElement;

profileIconLink.addEventListener("click", (event) => {
    event.preventDefault(); 
    profileModal.showModal();
    document.body.classList.add('no-scroll');
    profileModal.style.display = "flex";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileModal.open) {
    profileModal.close();
    document.body.classList.remove('no-scroll');
    profileModal.style.display = "none";
  }
});

const profileMobileNav = document.getElementById('profile') as HTMLAnchorElement;
const cartMobileNav = document.getElementById('cart') as HTMLAnchorElement;

profileMobileNav.addEventListener("click", (event) => {
    event.preventDefault();
    renderOrderHistory(); 
    profileModal.showModal();
    document.body.classList.add('no-scroll');
    profileModal.style.display = "flex";
});

cartMobileNav.addEventListener("click", (event) => {
    event.preventDefault(); 
    shoppingCarttModal.showModal();
    document.body.classList.add('no-scroll');
    shoppingCarttModal.style.display = "grid";
});


/**
 * Manages the display and interaction with the sign-up modal.
 */
const signUpModal = document.getElementById("signUpModal") as HTMLDialogElement;

document.getElementById("openSignUpModal")?.addEventListener("click", (e: Event) => {
    e.preventDefault();
    
    if(profileModal && signUpModal) {
        profileModal.close();
        profileModal.style.display = "none";
        signUpModal.style.display = "flex";
        signUpModal.showModal();
    }
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && signUpModal.open) {
        signUpModal.close();
        signUpModal.style.display = "none";
        document.body.classList.remove('no-scroll');
    }
});

/**
 * Attaches click event listeners to close buttons of dialogues.
 * 
 * When a button is clicked, it closes and hides profile and sign-up modals
 * and enables scrolling on the body.
 */
const closeButtonForDialogs = document.querySelectorAll(".close-btn") as NodeListOf<HTMLButtonElement>;

closeButtonForDialogs.forEach((button) => {
    button.onclick = () => {
        profileModal.close();
        profileModal.style.display = "none";
        signUpModal.close();
        signUpModal.style.display = "none";
        document.body.classList.remove('no-scroll');
    };
});


/**
 * Manages the display and interaction with the shopping cart modal.
 */
const shoppingCarttModal = document.getElementById("shoppingCart") as HTMLDialogElement;
const cartIcon = document.getElementById("cart-icon") as HTMLAnchorElement;

cartIcon.addEventListener("click", (event) => {
    event.preventDefault(); 
    shoppingCarttModal.showModal();
    document.body.classList.add('no-scroll');
    shoppingCarttModal.style.display = "grid";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && shoppingCarttModal.open) {
    shoppingCarttModal.close();
    document.body.classList.remove('no-scroll');
    shoppingCarttModal.style.display = "none";
  }
});

/**
 * 
 */
document.addEventListener('DOMContentLoaded', () => {
    const closeIcon = document.getElementById('close-icon');
    const navbarLinks = document.querySelectorAll('.navbar a');

    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (closeIcon && window.innerWidth <= 826) { // Assuming 768px is your mobile breakpoint
                closeIcon.click();
            }
        });
    });
});


/**
 * Generates a role-specific user interface based on the current user's role.
 */
const generateRoleSpecificUI = (): void => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.log("No user logged in.");
        return;
    }

    const container = document.getElementById('panelAdminAndStaff') as HTMLDivElement;
    // console.log(container);
    if (!container) {
        console.error('Container for role-specific UI not found');
        return;
    }

    if (currentUser.role === 'admin') {
        const adminPanelButton = createPanelButton('Admin Panel', 'adminAndStaffPanel.html');
        container.appendChild(adminPanelButton);
    } else if (currentUser.role === 'staff') {
        const staffPanelButton = createPanelButton('Staff Panel', 'adminAndStaffPanel.html');
        container.appendChild(staffPanelButton);
    }
};

/**
 * Creates a button for navigating to different panels based on user roles.
 * @param {string} buttonText - Text to display on the button.
 * @param {string} pageUrl - URL to navigate to when the button is clicked.
 * @returns {HTMLButtonElement} The created button element.
 */
const createPanelButton = (buttonText: string, pageUrl: string): HTMLButtonElement => {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.addEventListener('click', () => {
        // Optional: Add a confirmation dialog
        if (confirm('Do you want to enter the panel?')) {
            window.location.href = pageUrl;
        }
    });
    return button;
};

// register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
          // console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(err => {
          // console.log('Service Worker registration failed:', err);
        });
    });
  }
  


export { generateRoleSpecificUI };
