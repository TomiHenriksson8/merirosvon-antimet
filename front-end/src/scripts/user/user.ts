import { LoginUser } from '../../interfaces/LoginUser';
import { User } from '../../interfaces/User';

// REGISTER USER

const fetchGetExitingUsers = async () => {
    try {
        const response = await fetch('http://localhost:8000/api/users');
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const existingUsers = await response.json();
        console.log(existingUsers);
        return existingUsers;
    } catch (error) {
        console.error("Error fetching existing users:", error);
        throw error;
    }
};

const fetchPostNewUser = async (newUser: User) => {
    const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
};

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
        console.log("User registered successfully!");
    } catch (error) {
        console.error("Error registering user:", error);
    }
});

// LOGIN USER

const fetchLoginUser = async (loginData: LoginUser) => {
    try {
        const response = await fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const responseData = await response.json();
        console.log("Received user data:", responseData);
        return responseData.user; // Extract the user from the response
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
};

// Update UI with user data
function getLoginFormData(): LoginUser {
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

            // Prefill the profile form with user data
            prefillProfileForm();

            console.log("User logged in successfully!", user);

            // Optionally, hide login form and show logout button
            document.getElementById('profile-form-section')!.style.display = 'block';
            document.getElementById('login-header')!.style.display = 'none';
            document.getElementById('login-form')!.style.display = 'none';
            document.getElementById('logout-button')!.style.display = 'block';
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
});

function prefillProfileForm() {
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

function updateProfileInfo(username: string, email: string) {
    const usernameTarget = document.getElementById("username-target");
    const emailTarget = document.getElementById("email-target");
    console.log("Updating profile info:", username, email);

    if (usernameTarget) {
        usernameTarget.textContent = username;
    }
    if (emailTarget) {
        emailTarget.textContent = email;
    }
};

document.getElementById('logout-button')?.addEventListener('click', () => {
    localStorage.removeItem('user');
    updateProfileInfo('', '');
    console.log("User logged out successfully");

    // Update UI
    document.getElementById('profile-form-section')!.style.display = 'none';
    document.getElementById('login-header')!.style.display = 'block';
    document.getElementById('login-form')!.style.display = 'block';
    document.getElementById('logout-button')!.style.display = 'none';
});

// EDIT USER
const fetchUpdateUserProfile = async (userId: number, updatedData: { username?: string; email?: string, role: string }) => {
    try {
        console.log("Updating user profile:", userId, updatedData);
        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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
        console.error("Error updating user profile:", error);
        throw error;
    }
};

document.getElementById("profile-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById("profile-username") as HTMLInputElement;
    const emailInput = document.getElementById("profile-email") as HTMLInputElement;

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser.id) {
        console.error("No user logged in or user ID missing");
        return;
    }

    const updatedData = {
        id: currentUser.id,
        username: usernameInput.value,
        email: emailInput.value,
        role: currentUser.role,
        // Including the role, but still not including the password.
        // If the backend requires the password, you need to handle it securely.
    };

    try {
        const updatedUser = await fetchUpdateUserProfile(currentUser.id, updatedData);
        localStorage.setItem('user', JSON.stringify({ ...currentUser, username: updatedUser.username, email: updatedUser.email }));
        updateProfileInfo(updatedUser.username, updatedUser.email);
        console.log("Profile updated successfully!", updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error);
    }
});






