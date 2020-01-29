const { readFileSync, existsSync, statSync, writeFileSync } = require('fs');
const CONTENT_TYPES = require('./lib/mimeTypes');
const { loadTemplate } = require('./lib/viewTemplates');

const STATIC_DIR = `${__dirname}/public`;
const STORAGE_FILE = `${__dirname}/commentInfo.json`;

const serveHomePage = (request, response) => {
  request.url = '/index.html';
  return serveStaticFile(request, response);
};

const isFileValid = (path) => {
  const status = existsSync(path) && statSync(path);
  return status || status.isFile;
};

const generateOkResponse = function (contentType, content, response) {
  response.statusCode = 200;
  response.setHeader('Content-Type', contentType);
  response.setHeader('Content-Length', content.length);
  return response.end(content);
};

const serveStaticFile = function (request, response) {
  const filePath = `${STATIC_DIR}${request.url}`
  if (!isFileValid(filePath)) return serveNotFoundResponse(request, response);
  const [, extension] = request.url.match(/.*\.(.*)$/);
  const content = readFileSync(filePath);
  const contentType = CONTENT_TYPES[extension];
  return generateOkResponse(contentType, content, response);
};

const generateCommentInfo = (body) => {
  const { usrName, comment } = organizeQueryParams(body)
  return { date: new Date().toJSON(), usrName, comment };
};

const loadComments = () => {
  if (!existsSync(STORAGE_FILE)) return [];
  return JSON.parse(readFileSync(STORAGE_FILE, 'utf8'));
};

const decodeValue = (text) => {
  const decoded = decodeURIComponent(text);
  let value = decoded.replace(/\+/g, ' ');
  return value;
};

const pickupParams = (keyValuePairs, keyValue) => {
  const [key, value] = keyValue.split('=');
  keyValuePairs[key] = decodeValue(value);
  return keyValuePairs;
};

const organizeQueryParams = (keyValuePairs) => keyValuePairs.split('&').reduce(pickupParams, {});

const storeComment = (body) => {
  const newComment = generateCommentInfo(body);
  const storedComments = loadComments();
  storedComments.unshift(newComment);
  const commentsInfoString = JSON.stringify(storedComments)
  writeFileSync(STORAGE_FILE, commentsInfoString);
}

const updateComment = function (req, res) {
  let body = '';
  req.on('data', data => body += data);
  req.on('end', () => {
    storeComment(body);
    return serveGuestPage(req, res)
  });
};

const formateSingleComment = function (comment) {
  const date = new Date(comment.date);
  return `<div class="guestCommentBox">
      <span class="cmtGuestName">${comment.usrName}</span>
      <span class="cmtDate">${date.toLocaleString()}</span><br>
      <span>${comment.comment}</span>
    </div>`;
};

const formateComments = (comments) => {
  return comments.reduce((formattedCom, comment) =>
    `${formattedCom}\n ${formateSingleComment(comment)} </br>`, '')
};

const serveGuestPage = function (req, response) {
  const comments = loadComments();
  const formattedComments = formateComments(comments);
  const html = loadTemplate(req.url, { 'comments': formattedComments });
  return generateOkResponse(CONTENT_TYPES.html, html, response);
};

const serveNotFoundResponse = (request, response) => {
  response.statusCode = 404;
  response.setHeader('Content-Length', 0);
  return response.end();
}

const findHandle = function (req) {
  if (req.method === 'GET' && req.url === '/') return serveHomePage;
  if (req.method === 'GET' && req.url === '/guestBook.html') return serveGuestPage;
  if (req.method === 'GET') return serveStaticFile;
  if (req.method === 'POST' && req.url === '/guestBook.html') return updateComment;
  return serveNotFoundResponse;
};

const processRequest = function (request, response) {
  console.warn(`Request: {method: ${request.method}, url :${request.url}}\n`);
  const handler = findHandle(request);
  return handler(request, response);
};

module.exports = { processRequest };