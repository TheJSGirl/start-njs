
process.env.NODE_ENV = 'development';

const _ = require('lodash');

const baseSettings = require('./base');

const settings = {
  port: 3000,
  database: {
    host: 'localhost',
    port: 27017,
    db: 'test-njs',
  },
  sessions: {
    store: {
      host: 'localhost',
      port: 27017,
      db: 'test-njs',
      collection: 'sessions',
    },
  },
};

module.exports = _.merge(baseSettings, settings);
