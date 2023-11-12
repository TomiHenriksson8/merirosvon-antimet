import { Request, Response } from 'express';
import { User } from '../models/User';
import { users } from '../test-data/user';
import exp from 'constants';
import { hashPassword } from '../utils/hashPassword';


const getUsers = (req: Request, res: Response) => {
    res.status(200).json(users);
}

const registerUser = (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const newUser: User = {
        id: users.length + 1,
        username,
        email,
        password,
        role : 'user'
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

const loginUser = (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
};

const getUserById = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const deleteUser = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(user => user.id === id); 
    if (index !== -1) { 
      users.splice(index, 1);
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  }

  const updateUser = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { password, ...updateData } = req.body;
    const index = users.findIndex(user => user.id === id);
    
    if (index !== -1) {
      const updatedUser = { ...users[index], ...updateData };
      if (password) {
        updatedUser.password = hashPassword(password); 
      }
      users[index] = updatedUser;
      const { password: excludedPassword, ...responseUser } = users[index];
      res.status(200).json(responseUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  };
  
  

export { registerUser, loginUser, getUsers, getUserById, deleteUser, updateUser };