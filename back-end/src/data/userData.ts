import { User } from "../models/User";
import { promisePool } from "../database/database";
import { RowDataPacket } from 'mysql2';

/**
 * Retrieves all users
 * @returns {Promise<any>} A promise that resolves to all users
 * @throws {Error} An error that contains the error code and message
 */
const fetchAllUsers = async (): Promise<any> => {
  try {
    const sql = "SELECT * FROM Users";
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("error", e.message);
      throw e;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

/**
 * Creates a new user
 * @param {User} user - The user to create
 * @returns {Promise<User>} A promise that resolves to the created user
 * @throws {Error} An error that contains the error code and message
 */
const createUser = async (user: User): Promise<User> => {
  const { username, email, password } = user;
  const sql = `INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, 'user')`;
  await promisePool.query(sql, [username, email, password]);
  return { ...user };
};

/**
 * Retrieves a user by username
 * @param {string} username - The username
 * @returns {Promise<User | null>} A promise that resolves to the user
 * @throws {Error} An error that contains the error code and message
 */
const fetchUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const sql = 'SELECT * FROM Users WHERE username = ?';
    const [rows] = await promisePool.query<RowDataPacket[]>(sql, [username]);
    if (rows.length === 0) {
      return null;
    }
    const user: User = rows[0] as unknown as User;
    return user;
  } catch (error) {
    throw error; 
  }
};

/**
 * Retrieves a user by id
 * @param {number} id - The user id
 * @returns {Promise<User | null>} A promise that resolves to the user
 * @throws {Error} An error that contains the error code and message
 */
const fetchUserById = async (id: number): Promise<User | null> => {
  try {
    const sql = 'SELECT * FROM Users WHERE id = ?';
    const [rows] = await promisePool.query<RowDataPacket[]>(sql, [id]);
    if (rows.length === 0) {
      return null;
    }
    const user: User = rows[0] as unknown as User;
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Retrieves the latest user id
 * @returns {Promise<number | null>} A promise that resolves to the latest user id
 * @throws {Error} An error that contains the error code and message
 */
const fetchLatestUserId = async (): Promise<number | null> => {
  try {
    const [rows] = await promisePool.query<RowDataPacket[]>('SELECT id FROM Users ORDER BY id DESC LIMIT 1');
    if (rows.length > 0 && 'id' in rows[0]) {
      return rows[0].id as number;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching the latest user ID:', error);
    throw error;
  }
};

/**
 * Deletes a user by id
 * @param {number} id - The user id
 * @returns {Promise<void>} A promise that resolves when the user has been deleted
 * @throws {Error} An error that contains the error code and message
 */
const deleteUser = async (id: number): Promise<void> => {
  try {
    const sql = 'DELETE FROM Users WHERE id = ?';
    await promisePool.query(sql, [id]);
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a user
 * @param {User} user - The user to update
 * @returns {Promise<User>} A promise that resolves to the updated user
 * @throws {Error} An error that contains the error code and message
 */
const updateUser = async (user: User): Promise<User> => {
  try {
      let sql = 'UPDATE Users SET ';
      const params: (string | number)[] = [];

      if (typeof user.username === 'string') {
          sql += 'username = ?, ';
          params.push(user.username);
      }
      if (typeof user.email === 'string') {
          sql += 'email = ?, ';
          params.push(user.email);
      }
      if (typeof user.password === 'string') {
          sql += 'password = ?, ';
          params.push(user.password);
      }
      if (typeof user.role === 'string') {
          sql += 'role = ?, ';
          params.push(user.role);
      }
      if (typeof user.id === 'number') {
          sql = sql.slice(0, -2) + ' WHERE id = ?';
          params.push(user.id);
      } else {
          throw new Error("User ID is missing or invalid");
      }
      await promisePool.query(sql, params);
      return { id: user.id, username: user.username, email: user.email, role: user.role };
  } catch (error) {
      throw error; 
  }
};


export {
  fetchAllUsers,
  createUser,
  fetchUserByUsername,
  fetchUserById,
  fetchLatestUserId,
  deleteUser,
  updateUser
};
