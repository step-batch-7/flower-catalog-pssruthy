const http = require('http');
const { methodHandlers } = require('./lib/handlers');

const matchedHandlers = function (request, router) {
	return request.url.match(router.path);
}

const processRequest = function (request, response) {
	const { address, port } = request.socket.address();
	const remote = `{ address: ${address}, port: ${port}}`;
	console.warn(`Connected to ${remote}`);

	const routers = methodHandlers[request.method] || methodHandlers.notFount;
	const matchingHandlers = routers.filter((router) => matchedHandlers(request, router));
	const next = () => {
		const router = matchingHandlers.shift();
		router.handler(request, response);
	};
	next();
};

const main = function (port) {
	const server = new http.Server(processRequest);
	server.on('error', (error) => console.error('------Sever Error: ', error.message));
	server.listen(port, () => console.warn(`Serving HTTP on 0.0.0.0 port ${port} (http://0.0.0.0:${port}/) ...`)
	)
};

main(8000);