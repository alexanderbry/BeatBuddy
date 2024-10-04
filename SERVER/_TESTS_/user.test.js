const request = require('supertest');
const app = require('../app');
const { sequelize, User, Profile } = require('../models');
const { describe, it, expect, beforeAll, afterAll, test } = require('@jest/globals');


describe('User API', () => {
  beforeAll(async () => {
    // Connect to the test database
    await sequelize.authenticate();
    
    // Sync the database (this will create tables if they don't exist)
    await sequelize.sync({ force: true });
    
    // Seed the database with test data
    await User.create({
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123'
    });
  });

  afterAll(async () => {
    // Delete all data and close the database connection
    await sequelize.truncate({ cascade: true });
    await sequelize.close();
  });

  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          email: 'newuser@example.com',
          username: 'newuser',
          password: 'newpassword123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('newuser@example.com');
      expect(res.body.username).toBe('newuser');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should return an error for duplicate email', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          email: 'test@example.com',
          username: 'anotheruser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('email must be unique');
    });

    it('should return an error for invalid email format', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({
          email: 'invalidemail',
          username: 'invaliduser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Invalid email format');
    });
  });

  describe('POST /users/login', () => {
    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('access_token');
    });

    it('should return an error for invalid credentials', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid email/password');
    });

    it('should return an error when email is missing', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email is required');
    });

    it('should return an error when password is missing', async () => {
      const res = await request(app)
        .post('/users/login')
        .send({
          email: 'test@example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Password is required');
    });
  });

  describe('GET /users/login/spotify', () => {
    it('should redirect to Spotify authorization page', async () => {
      const res = await request(app).get('/users/login/spotify');

      expect(res.statusCode).toBe(302);
      expect(res.header.location).toContain('https://accounts.spotify.com/authorize');
    });
  });

  describe('POST /users/login/google', () => {
    // Note: Testing Google login might require mocking the OAuth2Client
    it('should return 400 for invalid Google token', async () => {
      const res = await request(app)
        .post('/users/login/google')
        .send({
          googleToken: 'invalid_token'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  // Note: Testing the callback route would require mocking Spotify's API responses
  // and is beyond the scope of this basic test suite.
});