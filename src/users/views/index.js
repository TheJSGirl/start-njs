const validator = require('validator');
const Access = require('../../../utils/access');
const operations = require('../operations');
const { formatProfileResponse } = require('../../../utils');

async function myProfile(ctx) {
  Access.isAuthenticated(ctx);

  const id = ctx.request.user.id;

  const user = await operations.findById(id, {}, 'batch');
  const response = formatProfileResponse(user);

  if (user.admin) {
    response.admin = true;
  }

  ctx.successJson(response);
}

async function get(ctx) {
  Access.isAuthenticated(ctx);
  const options = ctx.request.query;

  const id = ctx.params.id;
  const conditions = {};
  if (validator.isMongoId(id)) {
    conditions._id = id;
  } else {
    conditions.username = id;
  }

  const user = await operations.findOne(conditions, options.populate);
  const response = formatProfileResponse(user);

  if (user.admin) {
    response.admin = true;
  }

  ctx.successJson(response);
}

async function updateProfile(ctx) {
  Access.isAuthenticated(ctx);

  const data = ctx.request.fields;
  const id = ctx.request.user._id;


  const user = await operations.updateProfile(id, data);
  const response = formatProfileResponse(user);

  ctx.successJson(response);
}

async function follow(ctx) {
  Access.isAuthenticated(ctx);

  const profile = ctx.params.id;
  const user = ctx.request.user;


  const result = await operations.follow(user, profile);
  const response = formatProfileResponse(result);

  ctx.successJson(response);
}

async function unfollow(ctx) {
  Access.isAuthenticated(ctx);

  const profile = ctx.params.id;
  const user = ctx.request.user;


  const result = await operations.unfollow(user, profile);
  const response = formatProfileResponse(result);

  ctx.successJson(response);
}

async function forgotPassword(ctx) {
  const data = ctx.request.fields;
  const response = await operations.forgotPassword(data);
  ctx.successJson(response);
}

async function changePassword(ctx) {
  Access.isAuthenticated(ctx);

  const userId = ctx.request.user._id;
  const data = ctx.request.fields;

  const response = await operations.changePassword(userId, data);

  ctx.successJson(response);
}

async function points(ctx) {
  Access.isAuthenticated(ctx);

  const userId = ctx.request.user._id;
  const data = ctx.request.fields;

  const response = await operations.changePoints(userId, data);

  ctx.successJson(response);
}

module.exports = {
  myProfile,
  updateProfile,
  forgotPassword,
  changePassword,
  follow,
  unfollow,
  get,
  points,
};
