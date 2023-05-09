const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const { expect } = chai;

const User = require('../models/User');

chai.use(chaiHttp);

const LOCAL = 'http://localhost:3000';
const BASE = 'http://139.59.130.149:3000';
const API_BASE_URL = `${BASE}/users`;

describe('User API', async() => {
  let userId;
  let token;
  let token2;
  let token3;

  const testUser = {
    username: 'TestUser',
    email: 'test@example.com',
    password: 'testpassword',
  };

  const testUser2 = {
    username: 'TestUser2',
    email: 'test2@example.com',
    password: 'testpassword2',
  };

  const testUser3 = {
    username: 'TestUser3',
    email: 'test3@example.com',
    password: 'testpassword3',
  };

  it('POST /auth/signup - should register a new user', async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, testUser);
      expect(response.status).to.equal(201);
      expect(response.data).to.have.property('user');
      userId = response.data.user._id;
    } catch (error) {
      console.log('error');
    }
  });

  it('POST /auth/login - should log in the user', async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('token');
    token = response.data.token;
  });

  it('POST /auth/signup (TestUser2) - should register a new user (TestUser2)', async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, testUser2);
    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('user');
    testUser2._id = response.data.user._id;
  });

  it('POST /auth/login - should log in the user (TestUser2)', async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser2.email,
      password: testUser2.password,
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('token');
    token2 = response.data.token;
  });

  it('POST /auth/signup (TestUser3) - should register a new user (TestUser3)', async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, testUser3);
    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('user');
    testUser3._id = response.data.user._id;
  });

  it('POST /auth/login - should log in the user (TestUser3)', async () => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: testUser3.email,
      password: testUser3.password,
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('token');
    token3 = response.data.token;
  });
  it('GET /:id - should get user by ID', async () => {
    const response = await axios.get(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('username');
    expect(response.data.username).to.equal(testUser.username);
  });

  it('PUT /:id - should update user by ID', async () => {
    const response = await axios.put(
      `${API_BASE_URL}/${userId}`,
      { bio: 'Updated bio' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('bio');
    expect(response.data.bio).to.equal('Updated bio');
  });

  it('POST /:id/follow - should follow another user (TestUser2)', async () => {
    const response = await axios.post(`${API_BASE_URL}/${testUser2._id}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).to.equal(200);
    expect(response.data.message).to.include('User followed');
  });

  it('POST /:id/follow - should follow another user (TestUser3)', async () => {
    const response = await axios.post(`${API_BASE_URL}/${testUser3._id}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(response.status).to.equal(200);
    expect(response.data.message).to.include('User followed');
  });

  it('GET /:id/followers - should get the followers of a user', async () => {
    const response = await axios.get(`${API_BASE_URL}/${testUser2._id}/followers`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array').with.lengthOf(1);
  });

  it('GET /:id/following - should get the users followed by a user', async () => {
    const response = await axios.get(`${API_BASE_URL}/${userId}/following`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');
    expect(response.data).to.be.an('array').with.lengthOf(2);
  });

  it('DELETE /:id/follow/:followerId - should unfollow a user', async () => {
    const response = await axios.delete(`${API_BASE_URL}/${testUser2._id}/follow/${testUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data.message).to.include('User unfollowed');
  });


  it('DELETE /:id - should delete user 1 by ID', async () => {
    console.log('token', token)
    const response = await axios.delete(`${API_BASE_URL}/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message');
  });
  
  it('DELETE /:id - should delete user 2 by ID', async () => {
    console.log('token2', token2)
    const response = await axios.delete(`${API_BASE_URL}/${testUser2._id}`, {
      headers: { Authorization: `Bearer ${token2}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message');
  });
  
  it('DELETE /:id - should delete user 3 by ID', async () => {
    const response = await axios.delete(`${API_BASE_URL}/${testUser3._id}`, {
      headers: { Authorization: `Bearer ${token3}` },
    });
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message');
  });
});  
