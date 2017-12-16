const path = require('path');

const root = path.resolve(__dirname, '..');

module.exports = {
  rootDirectory: root,
  port: 80,
  socketPort: 3001,
  keys: ['12345689', '098765432'],
  logs: {
    path: path.join(root, 'logs', 'nascence.log'),
  },
  parser: {
    formLimit: '100mb',
    textLimit: '100mb',
    jsonLimit: '100mb',
  },
  authentication: {
    tokenKey: 'authToken',
  },
  cors: {
    enabled: true,
    credentials: true,
  },
  sessions: {
    enabled: true,
    store: {
      host: '127.0.0.1',
      port: 27017,
      db: 'test-njs',
      collection: 'sessions',
    },
    cookie: {
      domain: 'localhost',
    },
  },
};
