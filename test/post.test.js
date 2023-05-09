const axios = require('axios');
const { expect } = require('chai');
const BASE = 'http://139.59.130.149:3000';
const LOCAL = 'http://localhost:3000';


const API_BASE_URL = `${BASE}/posts`;
const AUTH_BASE_URL = `${BASE}/users/auth`;

const USER_BASE_URL = `${BASE}/users`;

const unauthorizedUserToken = 'your_unauthorized_user_token';

let postId;

const testUser = {
    username: 'TestUser',
    email: 'test@example.com',
    password: 'testpassword',
  };
  
  let token;
  let userId;
  
  describe('User registration and authentication', () => {
    describe('POST /auth/signup', () => {
      it('should register a new user', async () => {
        const response = await axios.post(`${AUTH_BASE_URL}/signup`, testUser);
        expect(response.status).to.equal(201);
        expect(response.data).to.have.property('user');
        userId = response.data.user._id;
      });
    });
  
    describe('POST /auth/login', () => {
      it('should log in the user', async () => {
        const response = await axios.post(`${AUTH_BASE_URL}/login`, {
          email: testUser.email,
          password: testUser.password,
        });
        expect(response.status).to.equal(200);
        expect(response.data).to.have.property('token');
        token = response.data.token;
      });
    });
  });

describe('Posts API', () => {
  describe('POST /', () => {
    it('should create a new post', async () => {
      const response = await axios.post(API_BASE_URL, {
        content: 'This is a test post',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('_id');
      postId = response.data._id;
    });
  });

  describe('GET /', () => {
    it('should get all posts', async () => {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
      expect(response.data).to.have.length(1);
    });
  });

  describe('GET /:id', () => {
    it('should get a post by ID', async () => {
      const response = await axios.get(`${API_BASE_URL}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('_id');
      expect(response.data._id).to.equal(postId);
    });
  });

  describe('PUT /:id', () => {
    it('should update a post', async () => {
      const response = await axios.put(`${API_BASE_URL}/${postId}`, {
        content: 'This is an updated test post',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('content');
      expect(response.data.content).to.equal('This is an updated test post');
    });

    it('should not update a post if the user is not authorized', async () => {
      try {
        await axios.put(`${API_BASE_URL}/${postId}`, {
          content: 'This should not work',
        }, {
          headers: { Authorization: `Bearer ${unauthorizedUserToken}` },
        });
      } catch (error) {
        expect(error.response.status).to.equal(401);
      }
    });
  });

  describe('DELETE /:id', () => {
    it('should not delete a post if the user is not authorized', async () => {
      try {
        await axios.delete(`${API_BASE_URL}/${postId}`, {
          headers: { Authorization: `Bearer ${unauthorizedUserToken}` },
        });
      } catch (error) {
        expect(error.response.status).to.equal(401);
      }
    });

    it('should delete a post', async () => {
      const response = await axios.delete(`${API_BASE_URL}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(204);
    });
  });
  describe('DELETE /:id', () => {
    it('should delete user 1 by ID', async () => {
      const response = await axios.delete(`${USER_BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('message');
    });
  });
});
