const plugins = require('mongoose-plugins');
const mongoose = require('mongoose');
const url = require('url');

const config = require('../config');

mongoose.Promise = Promise;

function makeMongoUrl() {
    const dbSettings = config.database;
    if (!dbSettings) {
        return false;
    }
    const urlObj = {
        hostname: dbSettings.host,
        port: dbSettings.port,
        pathname: `/${dbSettings.db}`,
        query: dbSettings.options,
        protocol: 'mongodb',
        slashes: true,
    };
    if (dbSettings.username) {
        urlObj.auth = `${dbSettings.username}:${(dbSettings.password || '')}`;
    }
    return url.format(urlObj);
}

function connectMongoDb() {
    if (mongoose.connect(makeMongoUrl(), { useMongoClient: true })) {
        mongoose.plugin(plugins.transformer);
    }
}

connectMongoDb();
