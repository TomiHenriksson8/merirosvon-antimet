import request from 'supertest';
import app from '../../src/app';


describe('Get all food items', () => {
    it('gets all food items', async () => {
        const response = await request(app)
        .get('/api/menu');
        expect(response.statusCode).toBe(200);
    });
});

describe('Get food item by id', () => {
    it('gets food item by id', async () => {
        const response = await request(app)
        .get('/api/menu/1');
        expect(response.statusCode).toBe(200);
    });
});