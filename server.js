const http = require('http');
const { processRequest } = require('./app');

const handleConnection = (request, response) => {
	request.setEncoding('utf8');
	const { address, port } = request.socket.address();
	const remote = `{ address: ${address}, port: ${port}}`;
	console.warn(`Connected to ${remote}`);
	processRequest(request, response);
};

const main = function (port) {
	const server = new http.Server(handleConnection);
	server.on('error', (error) => console.error('------Sever Error: ', error.message));
	server.listen(port, () => console.warn(`Serving HTTP on 0.0.0.0 port ${port} (http://0.0.0.0:${port}/) ...`)
	)
};

main(8000);