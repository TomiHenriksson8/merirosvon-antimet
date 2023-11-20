import { User } from "../models/User";
import { promisePool } from "../database/database";
import { RowDataPacket } from 'mysql2';

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

const createUser = async (user: User): Promise<User> => {
  const { username, email, password } = user;
  const sql = `INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, 'user')`;
  await promisePool.query(sql, [username, email, password]);
  return { ...user };
};

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
    throw error; // add better error handling
  }
};

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
    throw error; // add better error handling
  }
};

const deleteUser = async (id: number): Promise<void> => {
  try {
    const sql = 'DELETE FROM Users WHERE id = ?';
    await promisePool.query(sql, [id]);
  } catch (error) {
    throw error; // add better error handling
  }
};

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
      // Check if password is provided and is a string
      if (typeof user.password === 'string') {
          sql += 'password = ?, ';
          params.push(user.password); // Ensure password is hashed
      }
      if (typeof user.role === 'string') {
          sql += 'role = ?, ';
          params.push(user.role);
      }

      // Ensure id is provided and is a number
      if (typeof user.id === 'number') {
          sql = sql.slice(0, -2) + ' WHERE id = ?';
          params.push(user.id);
      } else {
          throw new Error("User ID is missing or invalid");
      }

      // Execute the query
      await promisePool.query(sql, params);

      // Return updated user data excluding password
      return { id: user.id, username: user.username, email: user.email, role: user.role };
  } catch (error) {
      throw error; // Better error handling can be added here
  }
};




export { fetchAllUsers, createUser, fetchUserByUsername, fetchUserById, deleteUser, updateUser };
