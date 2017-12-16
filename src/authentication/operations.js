const errors = require('njs/lib/errors');
const bcrypt = require('bcrypt');
const validator = require('validator');
const utils = require('../../utils');
const AuthToken = require('./models');
const User = require('../users/operations');

function generateToken(id) {
  const rndm = utils.randomString(5);
  return bcrypt.hashSync(`${id}${rndm}`, 12);
}

function getNewExpiry() {
  const d = new Date();
  d.setSeconds(d.getSeconds() + (30 * 24 * 3600));
  return d;
}

async function create(user, ipAddress) {
  const data = {
    user,
    ipAddress,
    token: generateToken(user._id),
    expires: getNewExpiry(),
  };

  const authToken = new AuthToken(data);

  await authToken.save();

  return authToken;
}

async function touchToken(token) {
  const authToken = await AuthToken.findOne({ token }).exec();

  if (authToken) {
    authToken.expires = getNewExpiry();
    await authToken.save();
  }

  return authToken;
}


async function findOne(conditions) {
  const authToken = await AuthToken.findOne(conditions).exec();
  if (!authToken) {
    throw new errors.NotFound('AuthToken not found');
  }
  return authToken;
}

async function remove(token) {
  const authToken = await findOne({ token });
  await authToken.remove();

  return authToken;
}

async function list(conditions = {}, sort = '', fields = '') {
  return AuthToken.find(conditions)
    .select(fields)
    .sort(sort)
    .exec();
}

async function signUp(data) {
  const userData = {
    email: data.email,
    mobile: data.mobile,
    name: data.name,
    username: data.username,
    password: data.password,
    subscribed: data.subscribe,
    practitioner: data.practitioner,
  };


  if (!userData.password || userData.password.length < 6) {
    throw new errors.InvalidData('Password should be of at least 6 characters');
  }

  const user = await User.create(userData);
  const authToken = await create(user, data.ipAddress);

  return [user, authToken, true];
}

async function classicSignIn(username, password) {
  const conditions = {};
  if (validator.isEmail(username)) {
    conditions.email = username;
  } else {
    conditions.username = username;
  }

  const user = await User.findOne(conditions, true);
  const passwordCheck = await User.checkPassword(user._id, password);

  if (passwordCheck) {
    return user;
  }

  throw new errors.InvalidData('Invalid username or password');
}

async function signIn(data) {
  const user = await classicSignIn(data.username, data.password);
  const authToken = await create(user, data.ipAddress);

  return [user, authToken];
}

module.exports = {
  signIn,
  signUp,
  findOne,
  list,
  remove,
  touchToken,
};
