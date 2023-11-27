import { User } from '../interfaces/User';

const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    return null;
  }
  try {
    const user: User = JSON.parse(userJson);
    return user;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export { getCurrentUser }