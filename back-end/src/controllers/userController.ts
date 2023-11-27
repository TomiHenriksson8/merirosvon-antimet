import { Request, Response } from "express";
import { User } from "../models/User";
import { users } from "../test-data/user";
import exp from "constants";
import { hashPassword } from "../utils/hashPassword";
import { createUser, deleteUser, fetchAllUsers, fetchUserById, fetchUserByUsername, updateUser } from "../data/userData";
import { createSecureServer } from "http2";
import bcrypt from 'bcrypt';


const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    // If there's an error, send a 500 Internal Server Error response
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Unknown Error",
      });
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
      role: "user",
    };
    const registeredUser = await createUser(newUser);
    res.status(201).json(registeredUser);
  } catch (e: unknown) {
    console.error("Registration error:", e);
    res.status(500).json({ error: 'Error registering new user', details: (e as Error).message });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await fetchUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    if (typeof user.password === 'string') {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      res.status(200).json({ message: 'Login successful', user: { ...user, password: undefined } }); // Hide password
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await fetchUserById(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const handleDeleteUserRequest = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    await deleteUser(userId);
    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const handleUpdateUserRequest = async (req: Request, res: Response) => {
  try {
    const userData: User = req.body;
    const updatedUser = await updateUser(userData);
    res.status(200).json({ message: 'User successfully updated', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  handleDeleteUserRequest,
  handleUpdateUserRequest,
};
