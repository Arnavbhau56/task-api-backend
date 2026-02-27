const request = require('supertest');
const app = require('../app');

describe('Auth Flow', () => {
  let accessToken;
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'password123',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('should login user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send(testUser);
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    accessToken = res.body.data.accessToken;
  });

  it('should access protected route with token', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/tasks')
      .set('Authorization', 'Bearer invalid');
    expect(res.status).toBe(401);
  });
});
