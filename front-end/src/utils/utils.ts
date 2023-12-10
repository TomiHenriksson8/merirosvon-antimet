import { User } from '../interfaces/User';

/**
 * Retrieves the current user from local storage.
 * Parses the user data from a JSON string to a User object.
 * If there's no user data in local storage or if parsing fails, returns null.
 * @returns {(User | null)} The current user as a User object, or null if not available or on error.
 */
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