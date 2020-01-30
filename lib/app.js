const matchRoute = (route, req) => {
  if (route.method) {
    return route.method === req.method && req.url.match(route.path);
  }
  return true;
};

class App {
  constructor () {
    this.routes = [];
  }
  get(path, handler) {
    this.routes.push({path, handler, method: 'GET'});
  }
  post(path, handler) {
    this.routes.push({path, handler, method: 'POST'});
  }
  use(middleWare) {
    this.routes.push({handler: middleWare});
  }
  serve(req, res) {
    process.stdout.write(`Request : ${req.method} ${req.url}\n`);
    const matchedHandlers = this.routes.filter((route) => {
      return matchRoute(route, req);
    });
    const next = function () {
      const router = matchedHandlers.shift();
      router.handler(req, res, next);
    };
    next();
  }
}

module.exports = {App};
