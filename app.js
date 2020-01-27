const {readFileSync, existsSync, statSync, writeFileSync} = require('fs');
const Response = require('./lib/response');
const CONTENT_TYPES = require('./lib/mimeTypes');
const {loadTemplate} = require('./lib/viewTemplates');

const STATIC_DIR = `${__dirname}/public`;
const STORAGE_FILE = `${__dirname}/commendInfo.json`;

const serveHomePage = request => {
  request.url = '/index.html';
  return serveStaticFile(request);
}

const isFileValid = (path) => {
  const status = existsSync(path) && statSync(path);
  return status || status.isFile;
}

const generateOkResponse = function(contentType,content){
  const response = new Response();
  response.statusCode = 200;
  response.setHeader('Content-Type', contentType);
  response.setHeader('Content-Length', content.length);
  response.body = content;
  return response;
}

const serveStaticFile = function(request){
  const filePath = `${STATIC_DIR}${request.url}`
	if(!isFileValid(filePath)) return new Response();
  const [,extension] = request.url.match(/.*\.(.*)$/);
  const content = readFileSync(filePath);
  const contentType = CONTENT_TYPES[extension];
  return generateOkResponse(contentType,content);
};

const generateCommitInfo = ({usrName, comment}) => {
  return {date: new Date().toJSON(), usrName, comment};
}

const loadComments = () => {
  if(!existsSync(STORAGE_FILE)) return [];
  return JSON.parse(readFileSync(STORAGE_FILE, 'utf8'));
}

const updateCommend = function(req) {
  const storedComments = loadComments();
  const newComment = generateCommitInfo(req.body);
  storedComments.unshift(newComment);
  const commentsInfoString = JSON.stringify(storedComments)
  writeFileSync(STORAGE_FILE, commentsInfoString);
  return serveGuestPage(req)  
}

const formateSingleComment = function(comment){
  const date = new Date(comment.date);
  return `<div class="guestCommentBox">
      <span class="cmtGuestName">${comment.usrName}</span>
      <span class="cmtDate">${date.toLocaleString()}</span><br>
      <span>${comment.comment}</span>
    </div>`;
};

const formateComments = (comments) => {
  return comments.reduce((formattedCom, comment)=> 
  `${formattedCom}\n ${formateSingleComment(comment)} </br>`,'')};

const serveGuestPage = function(req) {
  const comments = loadComments();
  const formattedComments = formateComments(comments);
  const html = loadTemplate(req.url, {'comments' : formattedComments});
  
  return generateOkResponse(CONTENT_TYPES.html, html);
}

const findHandle = function(req){
  if(req.method === 'GET' && req.url === '/') return serveHomePage;
  if(req.method === 'GET' && req.url === '/guestBook.html') return serveGuestPage;
  if(req.method === 'GET') return serveStaticFile;
  if(req.method === 'POST' && req.url === '/guestBook.html') return updateCommend;
	return ()=> new Response();
};

const processRequest = function(request){
  const handler = findHandle(request);
  return handler(request);
}

module.exports = { processRequest};