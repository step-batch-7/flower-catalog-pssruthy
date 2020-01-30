const http = require('http');
const {app} = require('./lib/handlers');
const {stderr, stdout} = process; 

const main = function (port) {
  const server = new http.Server(app.serve.bind(app));
  server.on('error', (error) => {
    stderr.write(`------Sever Error:${error.message}\n`);
  });
  server.listen(port, () => {
    stdout.write(`Serving HTTP on port ${port} (http://0.0.0.0:${port}/)\n`);
  });
};
const port = 8000;
main(port);
