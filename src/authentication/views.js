const Access = require('../../utils/access');
const config = require('../../config');
const operations = require('./operations');
const { formatProfileResponse } = require('../../utils');

const allowSession = config.sessions && config.sessions.enabled;
const sessionKey = allowSession ? (config.authentication.tokenKey || 'authToken') : '';

function setCookie(ctx, { token }, remember) {
  const options = {
    domain: config.sessions.cookie.domain,
    expires: remember ? new Date(new Date().getTime() + (1000 * 3600 * 24 * 365)) : undefined,
    httpOnly: false,
  };

  ctx.cookies.set('ntkn', token, options);
}

function formatResponse(user, authToken) {
  const response = formatProfileResponse(user);

  response.token = authToken.token;

  return response;
}

async function signUp(ctx) {
  const data = ctx.request.fields;
  data.ipAddress = ctx.request.ip;
  const res = await operations.signUp(data);

  const response = formatResponse(res[0], res[1]);

  if (allowSession) {
    ctx.session[sessionKey] = response.token;
  }

  setCookie(ctx, response.token);

  ctx.successJson(response);
}

async function signIn(ctx) {
  const data = ctx.request.fields;
  data.ipAddress = ctx.request.ip;

  const res = await operations.signIn(data);

  const response = formatResponse(res[0], res[1]);

  if (allowSession) {
    ctx.session[sessionKey] = response.token;
  }

  setCookie(ctx, response.token, data.remember);

  ctx.successJson(response);
}

async function signOut(ctx) {
  Access.isAuthenticated(ctx);
  const { token } = ctx.request;

  await operations.remove(token);

  ctx.session = null;
  ctx.cookies.set('ntkn', '', {
    domain: config.sessions.cookie.domain,
    expires: new Date(new Date().getTime() - (1000 * 3600 * 24 * 365)),
    httpOnly: false,
  });

  ctx.successJson();
}

module.exports = {
  signIn,
  signUp,
  signOut,
};
