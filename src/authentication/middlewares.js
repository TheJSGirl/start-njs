const operations = require('./operations');
const Users = require('../users/operations');
const config = require('../../config');

const allowSession = config.sessions && config.sessions.enabled;
const sessionKey = allowSession ? (config.authentication.tokenKey || 'authToken') : '';

function extractHeaderToken(headers) {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader) {
        const parts = authorizationHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer' && parts[1]) {
            return parts[1];
        }
    }
    return null;
}

function extractSessionToken(session) {
    if (allowSession && session) {
        return session[sessionKey];
    }
    return undefined;
}

async function fetchUser(id) {
    const user = await Users.findById(id, {}, true);
    return user;
}

async function fetchToken(token) {
    const authToken = await operations.findOne({ token });
    if (!authToken) {
        return {};
    }

    const user = await fetchUser(authToken.user);

    if (!user) {
        return {};
    }

    return user;
}

function touchToken(token) {
    operations.touchToken(token);
}

module.exports = async function AuthenticationMiddleware(ctx, next) {
    ctx.request.authenticated = false;
    ctx.request.user = undefined;
    ctx.request.token = undefined;

    const sessionToken = extractSessionToken(ctx.session);
    const headerToken = extractHeaderToken(ctx.request.headers);
    const cookieToken = ctx.cookies.get('superbToken');
    const token = sessionToken || headerToken || cookieToken;

    if (headerToken && token !== headerToken) {
    } else if (token) {
        try {
            const user = await fetchToken(token);
            ctx.request.authenticated = true;
            ctx.request.user = user;
            ctx.request.token = token;
            touchToken(token);
        } catch (e) {
            ctx.request.authenticated = false;
            ctx.request.user = undefined;
            ctx.request.token = undefined;
        }
    }

    await next();
};
