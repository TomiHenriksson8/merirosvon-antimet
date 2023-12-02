import { getCurrentUser } from '../utils/utils.js';
// login modal

const profileModal = document.getElementById("profileModal") as HTMLDialogElement;
const profileIconLink = document.getElementById("profile-icon") as HTMLAnchorElement;

profileIconLink.addEventListener("click", (event) => {
    event.preventDefault(); 
    profileModal.showModal();
    profileModal.style.display = "flex";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && profileModal.open) {
    profileModal.close();
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
        signUpModal.showModal();
    }
});

document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && signUpModal.open) signUpModal.close();
});

// cart modal 

const shoppingCarttModal = document.getElementById("shoppingCart") as HTMLDialogElement;
const cartIcon = document.getElementById("cart-icon") as HTMLAnchorElement;
const closeCart = document.querySelector(".close") as HTMLAnchorElement;

cartIcon.addEventListener("click", (event) => {
    event.preventDefault(); 
    shoppingCarttModal.showModal();
    shoppingCarttModal.style.display = "grid";
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && shoppingCarttModal.open) {
    shoppingCarttModal.close();
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

    const container = document.getElementById('panelAdminAndStaff');
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
        window.location.href = pageUrl;
    });
    return button;
};


generateRoleSpecificUI();
