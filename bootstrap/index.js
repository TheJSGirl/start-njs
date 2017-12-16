const njs = require('njs');
const routes = require('../src/routes');
const responses = require('./middlewares/responses');


module.exports = function bootstrap(config) {
  njs.init(config);
  require('./db');
  // Make njs.app.use to bind middlewares;
  njs.app.use(responses);
  njs.app.use(routes.routes());

  return njs.app;
};
