require('dotenv').config();
const request = require('supertest');

const app = require('../../app');

const { connectMongo } = require('../../db/connection');

describe('POST /user/login', () => {
  beforeAll(async () => {
    await connectMongo();
  });

  it('should return user and token', async () => {
    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, err => {
      if (err) console.error('Error at a server launch:', err);
      console.log('Database connection successful');
    });

    const mReq = { email: 'ihor@gmail.com', password: '12345' };

    const mRes = await request(server).post('/api/users/login').send(mReq);

    expect(mRes.statusCode).toBe(200);
    expect(mRes.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.objectContaining({
          email: expect.any(String),
          subscription: expect.any(String),
        }),
      })
    );
  });
});
