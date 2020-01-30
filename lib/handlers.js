const {readFileSync, existsSync, statSync, writeFileSync} = require('fs');
const CONTENT_TYPES = require('../lib/mimeTypes');
const {loadTemplate} = require('../lib/viewTemplates');
const {App} = require('./app');

const STATIC_DIR = `${__dirname}/../public`;
const STORAGE_FILE = `${__dirname}/../commentInfo.json`;
const TEMPLATE_DIR = `${__dirname}/../templates`;

const isFileNotValid = (path) => {
  const status = existsSync(path) && statSync(path);
  return !status || !status.isFile();
};

const generateOkResponse = function (contentType, content, response) {
  response.statusCode = 200;
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

const generateCommentInfo = (body) => {
  const {usrName, comment} = organizeQueryParams(body);
  return {date: new Date().toJSON(), usrName, comment};
};

const loadComments = () => {
  if (isFileNotValid(STORAGE_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(STORAGE_FILE, 'utf8'));
};

const decodeValue = (text) => {
  const decoded = decodeURIComponent(text);
  const value = decoded.replace(/\+/g, ' ');
  return value;
};

const pickupParams = (keyValuePairs, keyValue) => {
  const [key, value] = keyValue.split('=');
  keyValuePairs[key] = decodeValue(value);
  return keyValuePairs;
};

const organizeQueryParams = (keyValuePairs) => {
  return keyValuePairs.split('&').reduce(pickupParams, {});
};

const storeComment = (body) => {
  const newComment = generateCommentInfo(body);
  const storedComments = loadComments();
  storedComments.unshift(newComment);
  const commentsInfoString = JSON.stringify(storedComments);
  writeFileSync(STORAGE_FILE, commentsInfoString);
};

const updateComment = function (req, res, next) {
  storeComment(req.body);
  serveGuestPage(req, res, next);
};

const formateSingleComment = function (comment) {
  const date = new Date(comment.date);
  let div = '';
  div += '<div class="guestCommentBox">';
  div += `<span class="cmtGuestName">${comment.usrName}</span>`;
  div += `<span class="cmtDate">${date.toLocaleString()}</span><br>`;
  div += `<span>${comment.comment}</span>`;
  div += '</div>';
  return div;
};

const formateComments = (comments) => {
  return comments.reduce((formattedCom, comment) =>
    `${formattedCom}\n ${formateSingleComment(comment)} </br>`, '');
};

const serveGuestPage = function (req, response, next) {
  const path = `${TEMPLATE_DIR}${req.url}`;
  if (isFileNotValid(path)) {
    return next();
  }
  const comments = loadComments();
  const formattedComments = formateComments(comments);
  const html = loadTemplate(req.url, {'comments': formattedComments});
  generateOkResponse(CONTENT_TYPES.html, html, response);
};

const serveNotFoundResponse = (request, response) => {
  response.statusCode = 404;
  response.end('Oops!!!\nPage not fount');
};

const readBody = (req, res, next) => {
  let body = '';
  req.on('data', (data) => {
    body += data;
  });
  req.on('end', () => {
    req.body = body;
    next();
  });
};

const app = new App();

app.use(readBody);
app.get('/guestBook', serveGuestPage);
app.get('', serveStaticFile);
app.get('', serveNotFoundResponse);
app.post('/guestBook', updateComment);
app.post('', serveStaticFile);
app.use(serveNotFoundResponse);

module.exports = {app};