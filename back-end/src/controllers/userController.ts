import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword } from "../utils/hashPassword";
import { createUser, deleteUser, fetchAllUsers, fetchUserById, fetchLatestUserId, fetchUserByUsername, updateUser } from "../data/userData";
import { createSecureServer } from "http2"; // ?? check this
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * @api {get} /users Get all users
 * @apiName  GetUsers
 * @apiGroup User
 * @apiPermission admin
 * @apiSuccess {Object[]} users Users
 * @apiError ( 500 ) InternalServerError There was an issue getting the users
 */
const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    
    res
      .status(500)
      .json({
        error: error instanceof Error ? error.message : "Unknown Error",
      });
  }
};

/**
 * @api {post} /users/register Register new user
 * @apiName  RegisterUser
 * @apiGroup User
 * @apiPermission open to all
 * @apiParam {String} username Username
 * @apiParam {String} email Email
 * @apiParam {String} password Password
 * @apiSuccess {Object} user User
 * @apiError ( 500 ) InternalServerError There was an issue registering the user
 */
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

/**
 * @api {post} /users/login Login user
 * @apiName  LoginUser
 * @apiGroup User
 * @apiPermission open to all
 * @apiParam {String} username Username
 * @apiParam {String} password Password
 * @apiSuccess {Object} user User
 * @apiError ( 500 ) InternalServerError There was an issue logging in the user
 */
const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await fetchUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    if (typeof user.password === 'string' && await bcrypt.compare(password, user.password)) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
      }         

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        jwtSecret,  // Use the validated JWT_SECRET
        { expiresIn: '8h' }  // Token expires in 1 hour
      );

      // Send the token in the response
      res.status(200).json({ message: 'Login successful', token, user: { ...user, password: undefined } }); 
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * @api {get} /users/:id Get user by ID
 * @apiName  GetUserById
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {Number} id User ID
 * @apiSuccess {Object} user User
 * @apiError ( 404 ) NotFound User not found
 * @apiError ( 500 ) InternalServerError There was an issue getting the user
 */
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

/**
 * @api {get} /users/latest Get latest user ID
 * @apiName  GetLatestUserId
 * @apiGroup User
 * @apiPermission admin
 * @apiSuccess {Number} latestUserId Latest user ID
 * @apiError ( 500 ) InternalServerError There was an issue getting the latest user ID
 * @apiError ( 404 ) NotFound No users found
 */
const getLatestUserId = async (req: Request, res: Response) => {
  try {
    const latestUserId = await fetchLatestUserId();
    if (latestUserId !== null) {
      res.status(200).json({ latestUserId });
    } else {
      res.status(404).json({ message: 'No users found' });
    }
  } catch (error) {
    console.error('Error fetching the latest user ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * @api {delete} /users/:id Delete user by ID
 * @apiName  DeleteUserById
 * @apiGroup User
 * @apiPermission admin
 * @apiParam {Number} id User ID
 * @apiSuccess {String} message User successfully deleted
 * @apiError ( 500 ) InternalServerError There was an issue deleting the user
 * @apiError ( 400 ) BadRequest Invalid user ID
 */
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

/**
 * @api {put} /users/:id Update user by ID
 * @apiName  UpdateUserById
 * @apiGroup User
 * @apiPermission authenticated
 * @apiParam {Number} id User ID
 * @apiParam {String} username Username
 * @apiParam {String} email Email
 * @apiParam {String} role Role
 * @apiSuccess {String} message User successfully updated
 * @apiError ( 500 ) InternalServerError There was an issue updating the user
 * @apiError ( 400 ) BadRequest Invalid user ID
 */
const handleUpdateUserRequest = async (req: Request, res: Response) => {
  try {
    const userIdFromParam = parseInt(req.params.id);
    const userIdFromToken = (req as any).user.userId;
    if (userIdFromToken !== userIdFromParam && (req as any).user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
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
  getLatestUserId,
  handleDeleteUserRequest,
  handleUpdateUserRequest,
};
