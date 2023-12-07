import { getCurrentUser } from '../utils/utils.js';
import { renderOrderHistory } from './order/order.js';
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

// sign up modal

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
    }
});

// cart modal 

const shoppingCarttModal = document.getElementById("shoppingCart") as HTMLDialogElement;
const cartIcon = document.getElementById("cart-icon") as HTMLAnchorElement;
const closeCart = document.querySelector(".close") as HTMLAnchorElement;

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

// check role and generate role-specific UI for index.html


const generateRoleSpecificUI = (): void => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.log("No user logged in.");
        return;
    }

    const container = document.getElementById('panelAdminAndStaff') as HTMLDivElement;
    console.log(container);
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

export { generateRoleSpecificUI };
