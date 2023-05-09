const axios = require('axios');
const { expect } = require('chai');

const LOCAL = 'http://localhost:3000';

const BASE = 'http://139.59.130.149:3000';
const API_BASE_URL = `${BASE}/posts`;
const COMMENTS_BASE_URL = `${BASE}/comments`;
const AUTH_BASE_URL = `${BASE}/users/auth`;
const POSTS_BASE_URL = `${BASE}/posts`;
const USER_BASE_URL = `${BASE}/users`;

const testUser = {
  username: 'TestUser',
  email: 'test@example.com',
  password: 'testpassword',
};

let token;
let postId;
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

describe('Create a post', () => {
    describe('POST /', () => {
        it('should create a new post', async () => {
          const response = await axios.post(POSTS_BASE_URL, {
            content: 'This is a test post',
          }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          expect(response.status).to.equal(201);
          expect(response.data).to.have.property('_id');
          postId = response.data._id;
        });
      });
});

describe('Comments API', () => {
  let commentId;

  describe('POST /:postId', () => {
    it('should create a new comment', async () => {
      const response = await axios.post(`${POSTS_BASE_URL}/${postId}/comments`, {
        content: 'Test comment',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('content', 'Test comment');
      commentId = response.data._id;
    });
  });

  describe('GET /:postId', () => {
    it('should fetch comments for a post', async () => {
      const response = await axios.get(`${POSTS_BASE_URL}/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.be.an('array');
    });
    
  });

  describe('PUT /:postId/:commentId', () => {
    it('should update a comment', async () => {
      const response = await axios.put(`${POSTS_BASE_URL}/${postId}/comments/${commentId}`, {
        content: 'Updated test comment',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('content', 'Updated test comment');
    });
  });

  describe('DELETE /:postId/:commentId', () => {
    it('should delete a comment', async () => {
      const response = await axios.delete(`${POSTS_BASE_URL}/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(204);
    });
  });
  
  describe('DELETE /:id', () => {
    it('should delete a post', async () => {
        const response = await axios.delete(`${API_BASE_URL}/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        expect(response.status).to.equal(204);
      });

    it('should delete user 1 by ID', async () => {
      const response = await axios.delete(`${USER_BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(response.status).to.equal(200);
      expect(response.data).to.have.property('message');
    });
  });
});
