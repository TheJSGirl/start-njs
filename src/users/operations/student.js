const _ = require('lodash');
const errors = require('njs/lib/errors');
const utils = require('../../../utils');
const { Student } = require('../models');

async function findOne(conditions, populate = 'batch') {
  const student = await Student.findOne(conditions).populate(populate).exec();
  if (!student) {
    throw new errors.NotFound('Student not found');
  }
  return student;
}

async function defaultFollows(user) {
  try {
    const usernames = [
      'bhagyashree',
      'pavni',
      'shijin',
      'aastha',
      'archana',
      'vidhula',
      'soumeet',
      'krishna',
      'nawaz',
      'vyas',
    ];
    const tasks = usernames.map(username => findOne({ username }));
    const users = await Promise.all(tasks);
    users.forEach((u) => {
      if (u && u._id) {
        user.follows.push(u._id);
      }
    });
    user.markModified('follows');
    await user.save();
  } catch (e) {
    console.log(e);
  }
}

async function findById(id, conditions = {}, populate) {
  conditions._id = id;
  return findOne(conditions, populate);
}

async function create(data) {
  utils.removeIdFields(data);

  if (!data.username) {
    data.username = utils.generateUsername(data.name);
  }

  if (!data.password) {
    data.password = data.username;
  }

  const student = new Student(data);
  await student.save();

  // await defaultFollows(student);
  mixpanel.createOrUpdateProfile(student);

  if (!data.noWelcome) {
    setTimeout(() => emails.welcome(student), 10);
  }

  return student;
}

async function update(id, data) {
  utils.removeIdFields(data);

  const student = await findById(id);
  Object.assign(student, data);
  await student.save();

  mixpanel.createOrUpdateProfile(student);

  return student;
}

async function progress(student, section) {
  if (!student._id) {
    student = await findById(student);
  }
  student.progress[section] = true;
  student.markModified('progress');
  await student.save();

  if (section === 'profilePicture') {
    Emitter.emit('profile-picture', student);
  }

  return student;
}

async function list(conditions = {}, sort = '', fields = '', populate = 'batch') {
  return Student.find(conditions)
    .select(fields)
    .populate(populate)
    .sort(sort)
    .exec();
}

async function count(conditions = {}) {
  return Student.count(conditions)
    .exec();
}

async function markDeleted(id) {
  return update(id, { deleted: true, active: false });
}

async function remove(id) {
  const student = await findById(id);
  await student.remove();

  return student;
}

module.exports = {
  create,
  update,
  list,
  count,
  remove,
  findById,
  findOne,
  markDeleted,
  progress,
};
