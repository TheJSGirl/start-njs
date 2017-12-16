const njs = require('njs');
const routes = require('../src/routes');

njs.app.use(routes.routes());
