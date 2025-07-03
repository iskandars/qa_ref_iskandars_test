const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const BASE_URL = 'https://petstore.swagger.io/v2';

describe('Pet API Tests', () => {
  let createdPetId; // To store the ID of the created pet for subsequent tests

  // Test Case 1: Automate "add new pet" test case and verify the response
  it('should add a new pet and verify the response (POST /pet)', async () => {
    const newPet = {
      id: 10001,
      category: {
        id: 1,
        name: 'Dogs'
      },
      name: 'DoggieTest',
      photoUrls: [
        'string'
      ],
      tags: [
        {
          id: 0,
          name: 'test-tag'
        }
      ],
      status: 'available'
    };

    const res = await chai.request(BASE_URL)
      .post('/pet')
      .send(newPet);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id', newPet.id);
    expect(res.body).to.have.property('name', newPet.name);
    expect(res.body).to.have.property('status', newPet.status);
    expect(res.body.category).to.have.property('name', newPet.category.name);

    createdPetId = res.body.id; // Store the ID for future tests
  });

  // Test Case 2: Automate "find pet by status" test case for "available"
  it('should find pets by status "available" and verify all pets have correct status (GET /pet/findByStatus)', async () => {
    const status = 'available';
    const res = await chai.request(BASE_URL)
      .get(`/pet/findByStatus?status=${status}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    expect(res.body).to.not.be.empty;

    // Verify that all pets in the response have the status "available"
    res.body.forEach(pet => {
      expect(pet).to.have.property('status', status);
    });
  });

  // Test Case 3: Automate "find pet by status" test case for "pending"
  it('should find pets by status "pending" and verify all pets have correct status (GET /pet/findByStatus)', async () => {
    const status = 'pending';
    const res = await chai.request(BASE_URL)
      .get(`/pet/findByStatus?status=${status}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    // Note: It's possible for there to be no pending pets at a given time,
    // so we don't assert that it's not empty, just that the statuses are correct if present.

    // Verify that all pets in the response have the status "pending"
    res.body.forEach(pet => {
      expect(pet).to.have.property('status', status);
    });
  });

  // Additional Pet Endpoint Tests (examples)

  it('should update an existing pet (PUT /pet)', async () => {
    if (!createdPetId) {
      // Skip if previous test failed to create a pet
      console.warn('Skipping update pet test as no pet was created.');
      return;
    }

    const updatedPet = {
      id: createdPetId,
      category: {
        id: 1,
        name: 'UpdatedDogs'
      },
      name: 'DoggieUpdated',
      photoUrls: [
        'string'
      ],
      tags: [
        {
          id: 0,
          name: 'updated-tag'
        }
      ],
      status: 'sold'
    };

    const res = await chai.request(BASE_URL)
      .put('/pet')
      .send(updatedPet);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id', updatedPet.id);
    expect(res.body).to.have.property('name', updatedPet.name);
    expect(res.body).to.have.property('status', updatedPet.status);
  });

  it('should find pet by ID (GET /pet/{petId})', async () => {
    if (!createdPetId) {
      console.warn('Skipping find pet by ID test as no pet was created.');
      return;
    }

    const res = await chai.request(BASE_URL)
      .get(`/pet/${createdPetId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id', createdPetId);
    expect(res.body).to.have.property('name', 'DoggieUpdated'); // Assuming it was updated
    expect(res.body).to.have.property('status', 'sold');
  });

  it('should delete a pet (DELETE /pet/{petId})', async () => {
    if (!createdPetId) {
      console.warn('Skipping delete pet test as no pet was created.');
      return;
    }

    const res = await chai.request(BASE_URL)
      .delete(`/pet/${createdPetId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', `${createdPetId}`);

    // Verify the pet is no longer found
    const getRes = await chai.request(BASE_URL)
      .get(`/pet/${createdPetId}`)
      .catch(err => err.response); // Catch the error response

    expect(getRes).to.have.status(404); // Expecting 404 Not Found
  });
});
