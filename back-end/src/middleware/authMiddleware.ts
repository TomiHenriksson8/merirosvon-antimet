import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Assuming "Bearer TOKEN"
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Add the user's information to the request object
    // You may want to have a User type/interface to provide type information
    (req as any).user = decoded;

    next(); // User is authenticated, proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const authorize = (roles: Array<'user' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next(); // User has the required role, proceed to the next middleware or route handler
  };
};