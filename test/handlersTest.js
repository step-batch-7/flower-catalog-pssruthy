const request = require('supertest');
const {app} = require('./../lib/handlers');
describe('GET', () => {
  describe('URL: /', () => {
    it('Should give the home page', (done) => { 
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '796', done);
    });
  });

  describe('URL: /guestBook.html', () => {
    it('Should give the guest book page', (done) => { 
      request(app.serve.bind(app))
        .get('/guestBook.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Type', 'text/html', done);
    });
  });

  describe('URL: /abeliophyllum.html', () => {
    it('Should give the flower content page', (done) => { 
      request(app.serve.bind(app))
        .get('/abeliophyllum.html')
        .set('Accept', '*/*')
        .expect(200)
        .expect('Content-Length', '1522')
        .expect('Content-Type', 'text/html', done);
    });
  });

  describe('URL: /badFile', () => {
    it('Should give error 404 when the url is not exists', (done) => { 
      request(app.serve.bind(app))
        .get('/badFile')
        .set('Accept', '*/*')
        .expect(404, done);
    });
  });

});
