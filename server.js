const { Server } = require('net');
const Request = require('./lib/request');
const {processRequest} = require('./app');

const handleRequestText = (text, socket) => {
  console.warn(`data: ${text}`);
	const req = Request.parse(text); 
  const response = processRequest(req);
	response.write(socket);  
};

const handleConnection = socket => {
	const remote = `{ ${socket.remoteAddress} : ${socket.remotePort}}`;
	console.warn(`Connected to ${remote}`);
	socket.setEncoding('utf8');
	socket.on('data', (text) => handleRequestText(text, socket));
	socket.on('error', (err) => console.warn('Error', err))
	socket.on('close', (err) => console.warn(`${remote} closed ${err ? 'with error' : ''}`));
	socket.on('end', () => console.warn(`${remote} ended`)); 
	socket.on('drain', () => console.warn(`${remote} drained`));
};

const main = function(port) {
	const server = new Server();
	server.on('connection', handleConnection);
	server.on('error', (error) => console.error('------Sever Error: ', error.message));
	server.listen(port,() => console.warn(`Serving HTTP on 0.0.0.0 port ${port} (http://0.0.0.0:${port}/) ...`)
 )
};

main(8000);