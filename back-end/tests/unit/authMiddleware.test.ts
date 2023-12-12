import { authenticate, authorize } from '../../src/middleware/authMiddleware';
import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';


jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  
    describe('authenticate', () => {
        // Test case 1
        it('should verify a token and call next', () => {
            const req = httpMocks.createRequest({
                headers: {
                    authorization: 'Bearer validtoken',
                },
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();

            (jwt.verify as jest.Mock).mockReturnValue({ id: 'user-id', role: 'user' });

            authenticate(req, res, next);

            expect(jwt.verify).toHaveBeenCalledWith('validtoken', process.env.JWT_SECRET);
            expect(next).toHaveBeenCalled();
        });
        // Test case 2
        it('should return 401 if no token provided', () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            const next = jest.fn();
            authenticate(req, res, next);
            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toEqual({ message: 'No token provided' });
            expect(next).not.toHaveBeenCalled();
        });
    });
    describe('Authorize Middleware', () => {
        it('should allow access if the user has an authorized role', () => {
            const roles: Array<'user' | 'admin' | 'staff'> = ['admin', 'user'];
            const user = { id: 'user-id', role: 'admin' };
            const req = httpMocks.createRequest({
                user: user,
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            const middleware = authorize(roles);
            middleware(req, res, next);
            expect(next).toHaveBeenCalled();
        });
        it('should deny access if the user does not have an authorized role', () => {
            const roles: Array<'user' | 'admin' | 'staff'> = ['admin'];
            const user = { id: 'user-id', role: 'user' };
            const req = httpMocks.createRequest({
                user: user,
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            const middleware = authorize(roles);
            middleware(req, res, next);
            expect(res.statusCode).toBe(403);
            expect(res._getJSONData()).toEqual({ message: 'Forbidden' });
            expect(next).not.toHaveBeenCalled();
        });
    });
});