const _ = require('lodash');
const errors = require('njs/lib/errors');
const bcrypt = require('bcrypt');
const utils = require('../../../utils');
const { User } = require('../models');

const PROFILE_CHANGES_ALLOWED = ['video', 'image', 'bio', 'birthDate'];

async function create(data) {
  utils.removeIdFields(data);

  const user = new User(data);
  await user.save();
  return user;
}

async function findOne(conditions, populate) {
  const user = await User.findOne(conditions).populate(populate ? 'batch center' : '').exec();
  if (!user) {
    throw new errors.NotFound('User not found');
  }
  return user;
}

async function findById(id, conditions = {}, populate) {
  conditions._id = id;
  return findOne(conditions, populate);
}

async function update(id, data) {
  utils.removeIdFields(data);

  const user = await findById(id);

  Object.assign(user, data);

  await user.save();
  if (user.isStudent()) {
    mixpanel.createOrUpdateProfile(user);
  }

  return user;
}

async function remove(id) {
  const user = await findById(id);
  await user.remove();

  return user;
}

async function list(conditions = {}, sort = '', fields = '', limit = 999) {
  return User.find(conditions)
    .select(fields)
    .sort(sort)
    .limit(limit)
    .exec();
}

async function checkPassword(id, password) {
  const user = await findById(id);
  return bcrypt.compareSync(password, user.password);
}

async function changePassword(id, { oldPassword, newPassword, confirmPassword }) {
  const user = await findById(id);
  const check = await checkPassword(id, oldPassword);

  if (!check) {
    throw new errors.InvalidData('Your old password is wrong');
  }
  if (newPassword !== confirmPassword) {
    throw new errors.InvalidData('Passwords do not match');
  }

  user.password = newPassword;
  await user.save();

  return user;
}

async function forgotPassword({ mobile, email }) {
  const conditions = {};

  if (mobile) {
    conditions.mobile = mobile;
  } else {
    conditions.email = email;
  }

  const user = await findOne(conditions);
  user.password = user.username;

  await user.save();

  if (conditions.mobile) {
    sms.forgotPassword(user);
  } else {
    emails.forgotPassword(user);
  }

  return true;
}

async function resetPassword(key, password, confirmPassword) {
  const user = await User.findOne({ 'verificationKeys.forgotPassword': key });

  if (password !== confirmPassword) {
    throw new errors.InvalidData('Passwords do not match');
  }

  user.password = password;
  await user.save();

  return user;
}

async function updateProfile(id, data) {
  data = _.pick(data, PROFILE_CHANGES_ALLOWED);
  return update(id, data);
}

async function follow(user, profile) {
  if (!user._id) {
    user = await findById(user);
  }
  user.follows.push(profile);
  user.markModified('follows');
  await user.save();

  if (user.isStudent()) {
    mixpanel.createOrUpdateProfile(user);
  }

  findById(profile).then((u) => {
    Notifications.followed(u, user);
    Emitter.emit('follow', u, user);
  });

  return user;
}

async function unfollow(user, profile) {
  if (!user._id) {
    user = await findById(user);
  }
  const index = user.follows.findIndex(u => u.toString() === profile.toString());
  if (index !== -1) {
    user.follows.splice(index, 1);
  }
  user.markModified('follows');
  await user.save();

  if (user.isStudent()) {
    mixpanel.createOrUpdateProfile(user);
  }

  return user;
}

async function changePoints(userId, { change, type }) {
  if (!type) {
    type = 'knowls';
  }
  const user = await findById(userId);
  if (type === 'knowls') {
    user.knowls += Number(change);
  } else if (type === 'dibbs') {
    user.dibbs += Number(change);
  } else {
    return user.knowls;
  }
  await user.save();
  return user.knowls;
}

module.exports = {
  create,
  findById,
  findOne,
  list,
  remove,
  update,
  checkPassword,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile,
  follow,
  unfollow,
  changePoints,
};
