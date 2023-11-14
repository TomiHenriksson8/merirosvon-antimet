import { LoginUser } from '../../interfaces/LoginUser';
import { User } from '../../interfaces/User';


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
        // Handle the error appropriately
        throw error;
    }
};


// REGISTER A NEW USER

const fetchPostNewUser = async (newUser: User) => {
    const existingUsers = await fetchGetExitingUsers();
    const newUserId = getLatestUserId(existingUsers) + 1;
    newUser.id = newUserId;
    newUser.role = 'user';
    // Post the new user to the backend
    const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });
    if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return response.json();
};

const getLatestUserId = (existingUsers: User[]) => {
    if (existingUsers.length === 0) {
      return 0;
    }
    const latestUser = existingUsers.reduce((prevUser, currentUser) => {
      return currentUser.id > prevUser.id ? currentUser : prevUser;
    });
    return latestUser.id;
};

function getSignUpFormData(): User {
    const usernameInput = document.getElementById("signUp-username") as HTMLInputElement;
    const passwordInput = document.getElementById("signUp-password") as HTMLInputElement;
    const emailInput = document.getElementById("signUp-email") as HTMLInputElement;
    const formData: User = {
        id: 0, // default value
        username: usernameInput.value,
        password: passwordInput.value,
        email: emailInput.value,
        role: 'user',
    };
    return formData;
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

// LOGIN A USER

const fetchLoginUser = async (loginData: LoginUser) => {
    try {
        const response = await fetch('http://localhost:8000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const user = await response.json();
        return user;
    } catch (error) {
        console.error("Error during login:", error);
        // Handle the error appropriately
        throw error;
    }
};

function getLoginFormData(): LoginUser {
    const usernameInput = document.getElementById("username") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const formData: LoginUser = {
        username: usernameInput.value,
        password: passwordInput.value,
    };
    return formData;
}

document.getElementById("login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = getLoginFormData();
    try {
        const existingUsers = await fetchGetExitingUsers();
        const user = await fetchLoginUser(formData);

        // Assuming the fetchLoginUser method returns the user data including email
        const { username, email } = user;

        console.log("User logged in successfully!", user);
        updateProfileInfo(username, email);
    } catch (error) {
        console.error("Error logging in:", error);
    }
});


// UPDATE THE PROFILE INFO IN THE DIALOG

function updateProfileInfo(username: string, email: string) {
    // Get the profile info elements
    const usernameTarget = document.getElementById("username-target");
    const emailTarget = document.getElementById("email-target");

    // Update the profile info with the new data
    if (usernameTarget) {
        usernameTarget.textContent = username;
    }

    if (emailTarget) {
        emailTarget.textContent = email;
    }
}

// EDIT THE PROFILE INFO

