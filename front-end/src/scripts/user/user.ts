import { LoginUser } from '../../interfaces/LoginUser';
import { User } from '../../interfaces/User';

const fetchGetExitingUsers = async () => {
    const response = await fetch('http://localhost:8000/api/users');
    const existingUsers = await response.json();
    console.log(existingUsers); // delete later
    return existingUsers;
    // TODO: add error handling later
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
    const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
    });
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
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
        const user = await fetchLoginUser(formData);
        console.log("User logged in successfully!", user);
    } catch (error) {
        console.error("Error logging in:", error);
    }
});

