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

  it('Should give the css file for url /flowerCatalog.css', (done) => { 
    request(app.serve.bind(app))
      .get('/css/flowerCatalog.css')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'text/css', done);
  });

  it('Should give the flower page for the url /abeliophyllum.html', (done) => { 
    request(app.serve.bind(app))
      .get('/abeliophyllum.html')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Length', '1522')
      .expect('Content-Type', 'text/html', done);
  });

  it('Should give pdf file for url is /pdf/Abeliophyllum.pdf', (done) => {
    request(app.serve.bind(app))
      .get('/pdf/Abeliophyllum.pdf')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'application/pdf', done);
  });

  it('Should give image when url  is /img/pbase-Abeliophyllum.jpg', (done) => {
    request(app.serve.bind(app))
      .get('/img/pbase-Abeliophyllum.jpg')
      .set('Accept', '*/*')
      .expect(200)
      .expect('Content-Type', 'image/jpg', done);
  });

  it('Should give error 404 when the url /badFile is not exists ', (done) => { 
    request(app.serve.bind(app))
      .get('/badFile')
      .set('Accept', '*/*')
      .expect(404, done)
      .expect('Oops!!!\nPage not fount');
  });
});

describe('Method not allowed', () => {
  it('Should give 405 method PUT which is not allowed', (done) => {
    request(app.serve.bind(app))
      .put('/saveComment')
      .set('Accept', '*/*')
      .expect(405, done);
  });
});
