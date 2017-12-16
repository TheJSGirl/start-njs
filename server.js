// require the bootstrap function that
// will be used to create the app
const bootstrap = require('./bootstrap');

// config file is composed of all the ENV variables we need
const config = require('./config');

// get the port from config file
const { port } = config;

// bootstrap function is used to create the app
// using the config
// See: ./bootstrap/index.js for more
const app = bootstrap(config);

// listen to the port and export so that we can test the app using Mocha
module.exports = app.listen(port);

global.logger.info(`Listening on port ${port}`);
