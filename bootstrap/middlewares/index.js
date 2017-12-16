const njs = require('njs');

const responses = require('./responses');

// Make njs.app.use to bind middlewares;
njs.app.use(responses);
