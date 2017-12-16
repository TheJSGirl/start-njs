const errors = require('njs/lib/errors');
const _ = require('lodash');
const responses = require('../../utils/responses');

function parseError(e) {
    console.log(e);
    switch (e.name) {
        case 'ValidationError':
            for (const key of e.errors) {
                const err = e.errors[key];
                if (err.kind === 'required') {
                    return new errors.InvalidData(`${_.startCase(err.path)} is required`);
                }
            }
            break;
        case 'MongoError':
            if (e.code === 11000) {
                return new errors.InvalidData('Duplicate Record');
            }
            break;
        default:
            return e;
    }
    return e;
}

async function errorHandler(ctx, next) {
    try {
        await next();
    } catch (e) {
        const err = parseError(e);
        responses.errorJson(ctx, err);
        global.Logger.error(err);
    }
}

async function middlewares(ctx, next) {
    ctx.successJson = function successResponse(data) {
        responses.successJson(ctx, data);
    };

    await errorHandler(ctx, next);
}

module.exports = middlewares;
