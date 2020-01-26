const {readFileSync, existsSync, statSync} = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');

const STATIC_DIR = `${__dirname}/public`;

const serveHomePage = request => {
  request.url = '/index.html';
  return serveStaticFile(request);
}

const serveStaticFile = function(request){
	const filePath = `${STATIC_DIR}${request.url}`
  const status = existsSync(filePath) && statSync(filePath);
  if(!status || !status.isFile) return new Response();
  const [,extension] = request.url.match(/.*\.(.*)$/);
  const content = readFileSync(filePath);
  const contentType = CONTENT_TYPES[extension];
  const response = new Response();
  response.setHeader('Content-Type', contentType);
  response.setHeader('Content-Length', content.length);
  response.body = content;
  response.statusCode = 200;
  return response;
};

const findHandle = function(req){
	if(req.method === 'GET' && req.url === '/') return serveHomePage;
  if(req.method === 'GET') return serveStaticFile
	return ()=> new Response();
};

const processRequest = function(request){
  const handler = findHandle(request);
  return handler(request);
}

module.exports = { processRequest};