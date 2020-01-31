const {readFileSync, existsSync, statSync, writeFileSync} = require('fs');
const querystring = require('querystring');
const {loadTemplate} = require('../lib/viewTemplates');
const {App} = require('./app');
const {Comment, Comments} = require('./comments');
const CONTENT_TYPES = require('../lib/mimeTypes');
const STATUS_CODES = require('./statusCodes');

const STATIC_DIR = `${__dirname}/../public`;
const STORAGE_FILE = `${__dirname}/../commentInfo.json`;
const TEMPLATE_DIR = `${__dirname}/../templates`;

const loadComments = () => {
  if (isFileNotValid(STORAGE_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(STORAGE_FILE, 'utf8'));
};

const isFileNotValid = (path) => {
  const status = existsSync(path) && statSync(path);
  return !status || !status.isFile();
};

const comments = Comments.load(loadComments()); 

const generateOkResponse = function (contentType, content, response) {
  response.statusCode = STATUS_CODES.ok;
  response.setHeader('Content-Type', contentType);
  response.setHeader('Content-Length', content.length);
  response.end(content);
};

const getPath = function (path) {
  if (path === '/') {
    return `${STATIC_DIR}/index.html`;
  }
  return `${STATIC_DIR}${path}`;
};

const serveStaticFile = function (request, response, next) {
  const path = getPath(request.url);
  if (isFileNotValid(path)) {
    return next();
  }
  const [, extension] = path.match(/.*\.(.*)$/);
  const content = readFileSync(path);
  const contentType = CONTENT_TYPES[extension];
  generateOkResponse(contentType, content, response);
};

const storeComment = (body) => {
  const newComment = new Comment(body.usrName, body.comment, new Date());
  comments.add(newComment);
  writeFileSync(STORAGE_FILE, comments.toJSON());
};

const storeCommentAndRedirect = function (req, res) {
  storeComment(req.body);
  const statusCode = STATUS_CODES.redirection;
  res.setHeader('Location', 'guestBook.html');
  res.writeHead(statusCode);
  res.end();
};

const serveGuestPage = function (req, response, next) {
  const path = `${TEMPLATE_DIR}${req.url}`;
  if (isFileNotValid(path)) {
    return next();
  }
  const formattedComments = comments.toHTMLString();
  const html = loadTemplate(req.url, {'comments': formattedComments});
  generateOkResponse(CONTENT_TYPES.html, html, response);
};

const serveNotFoundResponse = (request, response) => {
  response.statusCode = STATUS_CODES.notFound;
  response.end('Oops!!!\nPage not fount');
};

const methodNotAllowed = (req, res) => {
  res.statusCode = STATUS_CODES.methodNotAllowed;
  res.end('Oops!!!\nMethod not allowed');
};

const readBody = (req, res, next) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    if(req.headers['content-type'] === 'application/x-www-form-urlencoded'){
      req.body = querystring.parse(req.body);
    }
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('/guestBook', serveGuestPage);
app.get('', serveStaticFile);
app.post('/saveComment', storeCommentAndRedirect);
app.get('', serveNotFoundResponse);
app.post('', serveNotFoundResponse);
app.use(methodNotAllowed);

module.exports = {app};
