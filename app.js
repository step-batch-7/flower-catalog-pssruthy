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

const generateCommitInfo = ({usrName, comment}) => {
  const date = new Date().toLocaleString();
  return {date, usrName, comment};
}

const loadComments = () => {
  if(!existsSync(STORAGE_FILE)) return [];
  return commentsInfo = JSON.parse(readFileSync(STORAGE_FILE, 'utf8'));
}

const updateCommend = function(req) {
  const storedComments = loadComments();
  const newComment = generateCommitInfo(req.body);
  storedComments.unshift(newComment);
  const commentsInfoString = JSON.stringify(storedComments)
  writeFileSync(STORAGE_FILE, commentsInfoString);
  req.url = '/guestBook.html';
  return serveGuestPage(req)  
}

const formateSingleComment = function(comment){
  return `<div class="guestCommentBox">
  <span class="cmdGuestName">${comment.usrName}</span> ${comment.date}<br>
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
  
  const response = new Response();
  response.statusCode = 200;
  response.setHeader('Content-Type', 'html');
  response.setHeader('Content-Length', html.length);
  response.body = html;
  return response;
}

const findHandle = function(req){
  if(req.method === 'GET' && req.url === '/') return serveHomePage;
  if(req.method === 'GET' && req.url === '/guestBook.html') return serveGuestPage;
  if(req.method === 'GET') return serveStaticFile;
  if(req.method === 'POST' && req.url === '/updateCommend') return updateCommend;
	return ()=> new Response();
};

const processRequest = function(request){
  const handler = findHandle(request);
  return handler(request);
}

module.exports = { processRequest};