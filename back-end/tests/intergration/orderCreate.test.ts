import request from 'supertest';
import app from '../../src/app';

describe('POST /api/order', () => {
    const userIdWithItems = 8;
    const userIdEmptyCart = 2;
    it('should create a new order for a user with items in the cart', async () => {
      const response = await request(app)
        .post('/api/order/create')
        .send({ userId: userIdWithItems });
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Order created successfully');
    });
    it('should return an error when user ID is not provided', async () => {
      const response = await request(app)
        .post('/api/order/create')
        .send({}); // No user ID provided
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'User ID is required');
    });
  
    it('should return an error when trying to create an order with an empty cart', async () => {
      const response = await request(app)
        .post('/api/order/create')
        .send({ userId: userIdEmptyCart });
  
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Cannot create an order with an empty cart.');
    });
  });