
import { LoginUser } from '../../interfaces/LoginUser';
import { User } from '../../interfaces/User';
import { getCurrentUser } from '../../utils/utils.js'; 
import { generateRoleSpecificUI } from '../app.js';
import { showPopup } from '../order/order.js';

/**
 * Checks if a user is logged in and updates the UI accordingly.
 */
function checkLoggedInUser() {
    const currentUser = getCurrentUser();
    if (currentUser) {
        updateProfileInfo(currentUser.username, currentUser.email);
        prefillProfileForm();
        document.getElementById('profile-form-section')!.style.display = 'block';
        document.getElementById('login-header')!.style.display = 'none';
        document.getElementById('login-form')!.style.display = 'none';
        document.getElementById('logout-button')!.style.display = 'block';
    } else {
        document.getElementById('profile-form-section')!.style.display = 'none';
        document.getElementById('login-header')!.style.display = 'block';
        document.getElementById('login-form')!.style.display = 'block';
        document.getElementById('logout-button')!.style.display = 'none';
    }
}
window.addEventListener('load', checkLoggedInUser);
document.getElementById("profile-icon")?.addEventListener("click", () => {
    checkLoggedInUser();
    
});

/**
 * Registers a new user.
 * @param {User} newUser - The new user to register.
 * @returns {Promise<User>} A promise that resolves to the registered user.
 */
const fetchPostNewUser = async (newUser: User) => {
    const response = await fetch('ucad-server1.northeurope.cloudapp.azure.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
};

/**
 * Retrieves sign-up form data and constructs a User object.
 * @returns {User} The constructed User object.
 */
function getSignUpFormData(): User {
    const usernameInput = document.getElementById("signUp-username") as HTMLInputElement;
    const passwordInput = document.getElementById("signUp-password") as HTMLInputElement;
    const emailInput = document.getElementById("signUp-email") as HTMLInputElement;
    return {
        username: usernameInput.value,
        password: passwordInput.value,
        email: emailInput.value,
        role: 'user',
    };
}

document.getElementById("signUp-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = getSignUpFormData();
    try {
        await fetchPostNewUser(formData);
        // console.log("User registered successfully!");
        showPopup('popup-lr-ok-container', 'Rekisteröityminen onnistui', 'Tilisi on luotu onnistuneesti!', './assets/images/success.png');
    } catch (error) {
        // console.error("Error registering user:", error);
        showPopup('popup-fail-lr-container', 'Rekisteröityminen epäonnistui', 'Tilin luominen ei onnistunut. Yritä uudelleen myöhemmin.', './assets/images/failure.png');
    }
});

/**
 * Logs in a user.
 * @param {LoginUser} loginData - The login credentials.
 * @returns {Promise<User>} A promise that resolves to the logged-in user.
 */
const fetchLoginUser = async (loginData: LoginUser) => {
    try {
        const response = await fetch('ucad-server1.northeurope.cloudapp.azure.com/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });
        const responseData = await response.json();
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(responseData.user));
            localStorage.setItem('token', responseData.token); 
            return responseData.user;
        } else {
            showPopup('popup-fail-o-container', 'Kirjautuminen epäonnistui', 'Virheellinen Käyttäjänimi tai Salasana.' , './assets/images/popupfail.png');
        }
    } catch (error) {
        // console.error("Error during login:", error);
        showPopup('popup-fail-o-container', 'Kirjautumisvirhe', 'Kirjautumisen aikana tapahtui virhe. Yritä uudelleen.', './assets/images/popupfail.png');
    }
};

/**
 * Retrieves login form data and constructs a LoginUser object.
 * @returns {LoginUser} The constructed LoginUser object.
 */
const getLoginFormData = (): LoginUser =>  {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    return {
        username: usernameInput.value,
        password: passwordInput.value,
    };
}
document.getElementById("login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = getLoginFormData();
    try {
        const user = await fetchLoginUser(formData);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            updateProfileInfo(user.username, user.email);
            prefillProfileForm();
            // console.log("User logged in successfully!", user);
            showPopup('popup-lr-ok-container', 'Kirjautuminen Onnistui', 'Olet kirjautunut sisään onnistuneesti. Tervetuloa takaisin!', './assets/images/success.png');
            document.getElementById('profile-form-section')!.style.display = 'block';
            document.getElementById('login-header')!.style.display = 'none';
            document.getElementById('login-form')!.style.display = 'none';
            document.getElementById('logout-button')!.style.display = 'block';
            generateRoleSpecificUI();
        }
    } catch (error) {
        // console.error("Error logging in:", error);
        showPopup('popup-fail-lr-container', 'Kirjautuminen Epäonnistui', 'Kirjautumisyrityksesi epäonnistui. Tarkista tunnistetietosi ja yritä uudelleen.', './assets/images/failure.png');
    }
});

/**
 * Prefills the profile form with the current user's information.
 */
const prefillProfileForm = () => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (currentUser && currentUser.username && currentUser.email) {
        const usernameInput = document.getElementById("profile-username") as HTMLInputElement;
        const emailInput = document.getElementById("profile-email") as HTMLInputElement;
        if (usernameInput && emailInput) {
            usernameInput.value = currentUser.username;
            emailInput.value = currentUser.email;
        }
    }
}

/**
 * Updates the profile information displayed on the UI.
 * @param {string} username - The user's username.
 * @param {string} email - The user's email.
 */
const updateProfileInfo = (username: string, email: string) => {
    const usernameTarget = document.getElementById("username-target");
    const emailTarget = document.getElementById("email-target");
    // console.log("Updating profile info:", username, email);
    if (usernameTarget) {
        usernameTarget.textContent = username;
    }
    if (emailTarget) {
        emailTarget.textContent = email;
    }
};

document.getElementById('logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    updateProfileInfo('', '');
    // console.log("User logged out successfully");
    document.getElementById('profile-form-section')!.style.display = 'none';
    document.getElementById('login-header')!.style.display = 'block';
    document.getElementById('login-form')!.style.display = 'block';
    document.getElementById('logout-button')!.style.display = 'none';
});

/**
 * Updates a user's profile.
 * @param {number} userId - The ID of the user.
 * @param {{ username?: string; email?: string, role: string }} updatedData - The updated user data.
 * @returns {Promise<User>} A promise that resolves to the updated user.
 */
const fetchUpdateUserProfile = async (userId: number, updatedData: { username?: string; email?: string, role: string }) => {
    const token = localStorage.getItem('token');
    try {
        // console.log("Updating user profile:", userId, updatedData);
        const response = await fetch(`ucad-server1.northeurope.cloudapp.azure.com/api/users/${userId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const updatedUserResponse = await response.json();
        if (updatedUserResponse && updatedUserResponse.user) {
            return { ...updatedUserResponse.user, id: userId };
        }
        throw new Error('Invalid response from server');
    } catch (error) {
        // console.error("Error updating user profile:", error);
        throw error;
    }
};

/**
 * Submits the updated user profile.
 * @param {Event} event - The submit event.
 */
document.getElementById("profile-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById("profile-username") as HTMLInputElement;
    const emailInput = document.getElementById("profile-email") as HTMLInputElement;

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
        // console.error("No user logged in or user ID missing");
        return;
    }
    const updatedData = {
        id: currentUser.id,
        username: usernameInput.value,
        email: emailInput.value,
        role: currentUser.role,
    };
    try {
        const updatedUser = await fetchUpdateUserProfile(currentUser.id, updatedData);
        localStorage.setItem('user', JSON.stringify({ ...currentUser, username: updatedUser.username, email: updatedUser.email }));
        updateProfileInfo(updatedUser.username, updatedUser.email);
        // console.log("Profile updated successfully!", updatedUser);
    } catch (error) {
        // console.error("Error updating profile:", error);
    }
});






