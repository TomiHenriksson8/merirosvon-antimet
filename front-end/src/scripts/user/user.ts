import { LoginUser } from '../../interfaces/LoginUser';
import { User } from '../../interfaces/User';

const fetchGetExitingUsers = async () => {
    const response = await fetch('http://localhost:8000/api/users');
    const existingUsers = await response.json();
    console.log(existingUsers); // delete later
    return existingUsers;
    // TODO: add error handling later
};

const fetchPostNewUser = async (newUser: User) => {
    const existingUsers = await fetchGetExitingUsers();
    
    const newUserId = getLatestUserId(existingUsers) + 1;

    // Set the new ID and role in the newUser object
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
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the form data using the getSignUpFormData function
    const formData = getSignUpFormData();

    // Call fetchPostNewUser to add the new user to the backend
    try {
        await fetchPostNewUser(formData);

        // Optionally, you can perform any actions after a successful registration here
        console.log("User registered successfully!");
    } catch (error) {
        // Handle errors if the registration fails
        console.error("Error registering user:", error);
    }
});