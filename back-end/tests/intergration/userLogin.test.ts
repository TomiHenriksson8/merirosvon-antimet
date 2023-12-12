import request from 'supertest';
import app from '../../src/app'; // adjust the import path as needed

describe('User Login', () => {
  it('successfully logs in an existing user', async () => {
    const loginData = {
      username: 'intergrationtest44',
      password: 'newpassword'
    };
    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  it('fails to log in with incorrect credentials', async () => {
    const loginData = {
      username: 'intergrationtest44',
      password: 'wrongPassword'
    };
    const response = await request(app)
      .post('/api/users/login')
      .send(loginData);
    expect(response.statusCode).toBe(401);
  });
});