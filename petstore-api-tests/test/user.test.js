const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const BASE_URL = 'https://petstore.swagger.io/v2';

describe('User API Tests', () => {
  const testUser = {
    id: 100,
    username: 'testuser_mocha',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    phone: '123-456-7890',
    userStatus: 1
  };

  it('should create a new user (POST /user)', async () => {
    const res = await chai.request(BASE_URL)
      .post('/user')
      .send(testUser);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('code', 200);
    expect(res.body).to.have.property('message', `${testUser.id}`);
  });

  it('should log user into the system (GET /user/login)', async () => {
    const res = await chai.request(BASE_URL)
      .get(`/user/login?username=${testUser.username}&password=${testUser.password}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('code', 200);
    expect(res.body).to.have.property('message').that.includes('logged in user session:');
  });

  it('should get user by user name (GET /user/{username})', async () => {
    const res = await chai.request(BASE_URL)
      .get(`/user/${testUser.username}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('username', testUser.username);
    expect(res.body).to.have.property('email', testUser.email);
  });

  it('should update an existing user (PUT /user/{username})', async () => {
    const updatedUser = {
      id: testUser.id,
      username: testUser.username,
      firstName: 'UpdatedTest',
      lastName: 'UpdatedUser',
      email: 'updated@example.com',
      password: 'newpassword123',
      phone: '987-654-3210',
      userStatus: 2
    };

    const res = await chai.request(BASE_URL)
      .put(`/user/${testUser.username}`)
      .send(updatedUser);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('code', 200);
    expect(res.body).to.have.property('message', `${updatedUser.id}`);

    // Verify the update
    const getRes = await chai.request(BASE_URL)
      .get(`/user/${testUser.username}`);

    expect(getRes).to.have.status(200);
    expect(getRes.body).to.have.property('email', updatedUser.email);
    expect(getRes.body).to.have.property('phone', updatedUser.phone);
  });

  it('should log user out of the system (GET /user/logout)', async () => {
    const res = await chai.request(BASE_URL)
      .get('/user/logout');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('code', 200);
    expect(res.body).to.have.property('message', 'ok');
  });

  it('should delete a user (DELETE /user/{username})', async () => {
    const res = await chai.request(BASE_URL)
      .delete(`/user/${testUser.username}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('code', 200);
    expect(res.body).to.have.property('message', testUser.username);

    // Verify the user is no longer found
    const getRes = await chai.request(BASE_URL)
      .get(`/user/${testUser.username}`)
      .catch(err => err.response);

    expect(getRes).to.have.status(404); // Expecting 404 Not Found
  });

  // Example for createWithArray/createWithList
  it('should create users with given input array (POST /user/createWithArray)', async () => {
    const usersArray = [{
      id: 101,
      username: 'user1',
      firstName: 'First',
      lastName: 'User',
      email: 'user1@example.com',
      password: 'password1',
      phone: '111-222-3333',
      userStatus: 1
    }, {
      id: 102,
      username: 'user2',
      firstName: 'Second',
      lastName: 'User',
      email: 'user2@example.com',
      password: 'password2',
      phone: '444-555-6666',
      userStatus: 1
    }];

    const res = await chai.request(BASE_URL)
      .post('/user/createWithArray')
      .send(usersArray);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('code', 200);
    expect(res.body).to.have.property('message', 'ok'); // The API often returns 'ok' for these
  });
});
