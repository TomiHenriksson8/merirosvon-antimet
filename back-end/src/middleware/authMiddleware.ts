import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate a user based on a JWT token.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the Express router.
 * @returns {void} If authentication fails, it sends a 401 Unauthorized response. 
 * Otherwise, it adds the decoded user information to the request object and calls the next middleware.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

/**
 * Middleware to authorize a user based on their role.
 * @param {Array<'user' | 'admin' | 'staff'>} roles - The roles authorized to access the resource.
 * @returns {Function} A middleware function that checks if the authenticated user has one of the specified roles.
 * If the user does not have the required role, it sends a 403 Forbidden response.
 */
export const authorize = (roles: Array<'user' | 'admin' | 'staff'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as any).user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next(); 
  };
};
