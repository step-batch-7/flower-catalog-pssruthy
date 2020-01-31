const request = require('supertest');
const {app} = require('./../lib/handlers');

describe('GET', () => {
  it('Should give the home page when the url is /', (done) => { 
    request(app.serve.bind(app))
      .get('/')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html')
      .expect('Content-Length', '796', done);
  });

  it('Should give the guest book page for the url /guestBook.html', (done) => { 
    request(app.serve.bind(app))
      .get('/guestBook.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/html', done);
  });

  it('Should give the flower page for the url /abeliophyllum.html', (done) => { 
    request(app.serve.bind(app))
      .get('/abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Length', '1522')
      .expect('Content-Type', 'text/html', done);
  });
  it('Should give error 404 when the url /badFile is not exists ', (done) => { 
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done);
  });
});
