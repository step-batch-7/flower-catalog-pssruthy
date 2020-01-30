const http = require('http');
const { app } = require('./lib/handlers');

const main = function (port) {
	const server = new http.Server(app.serve.bind(app));
	server.on('error', (error) => console.error('------Sever Error: ', error.message));
	server.listen(port, () => console.warn(`Serving HTTP on 0.0.0.0 port ${port} (http://0.0.0.0:${port}/) ...`)
	)
};

main(8000);