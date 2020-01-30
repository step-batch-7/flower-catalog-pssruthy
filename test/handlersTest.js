const request = require('supertest');
const {app} = require('./../lib/handlers');

describe('GET /', () => {
  it('Should give the home page', (done) => { 
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '796', done);
  });
});
