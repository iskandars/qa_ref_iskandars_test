const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const BASE_URL = 'https://petstore.swagger.io/v2';

describe('Store API Tests', () => {
  let orderId;

  it('should return pet inventories by status (GET /store/inventory)', async () => {
    const res = await chai.request(BASE_URL)
      .get('/store/inventory');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    // Expecting properties like 'available', 'pending', 'sold' etc.
    expect(res.body).to.have.property('available').that.is.a('number');
    expect(res.body).to.have.property('pending').that.is.a('number');
    expect(res.body).to.have.property('sold').that.is.a('number');
  });

  it('should place an order for a pet (POST /store/order)', async () => {
    const order = {
      id: 10000,
      petId: 10001, // Assuming this pet exists or was created in pet tests
      quantity: 1,
      shipDate: new Date().toISOString(),
      status: 'placed',
      complete: true
    };

    const res = await chai.request(BASE_URL)
      .post('/store/order')
      .send(order);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id').that.is.a('number');
    expect(res.body).to.have.property('petId', order.petId);
    expect(res.body).to.have.property('status', 'placed');

    orderId = res.body.id;
  });

  it('should find purchase order by ID (GET /store/order/{orderId})', async () => {
    if (!orderId) {
      console.warn('Skipping find order by ID test as no order was placed.');
      return;
    }

    const res = await chai.request(BASE_URL)
      .get(`/store/order/${orderId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('id', orderId);
    expect(res.body).to.have.property('status', 'placed');
  });

  it('should delete purchase order by ID (DELETE /store/order/{orderId})', async () => {
    if (!orderId) {
      console.warn('Skipping delete order test as no order was placed.');
      return;
    }

    const res = await chai.request(BASE_URL)
      .delete(`/store/order/${orderId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', `${orderId}`);

    // Verify the order is no longer found
    const getRes = await chai.request(BASE_URL)
      .get(`/store/order/${orderId}`)
      .catch(err => err.response);

    expect(getRes).to.have.status(404);
  });
});
