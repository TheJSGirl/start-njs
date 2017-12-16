const errors = require('njs/lib/errors');
const utils = require('../../../utils');
const { Student } = require('../models');


function generateUsername({ first, last }) {
    let username = `${first}.${last || ''}`.toLowerCase();
    if (username[username.length - 1] === '.') {
        username = first.toLowerCase();
    }

    return username;
}

async function findOne(conditions) {
    const student = await Student.findOne(conditions).exec();
    if (!student) {
        throw new errors.NotFound('Student not found');
    }
    return student;
}

async function findById(id, conditions = {}) {
    conditions._id = id;
    return findOne(conditions);
}

async function create(data) {
    utils.removeIdFields(data);

    if (!data.username) {
        data.username = generateUsername(data.name);
    }

    if (!data.password) {
        data.password = data.username;
    }

    const student = new Student(data);
    await student.save();

    await student.populate('batch center').execPopulate();
    mixpanel.createOrUpdateProfile(student.username, {
        name: student.name,
        created: student.created,
        knowls: student.knowls,
        dibbs: student.dibbs,
        batch: student.batch.name,
        center: student.center.name,
    });
    student.depopulate('batch');
    student.depopulate('center');

    setTimeout(() => emails.welcome(student), 10);

    return student;
}

async function update(id, data) {
    utils.removeIdFields(data);

    const student = await findById(id);
    Object.assign(student, data);
    await student.save();

    return student;
}

async function progress(student, section) {
    if (!student._id) {
        student = await findById(student);
    }
    student.progress[section] = true;
    student.markModified('progress');
    await student.save();

    return student;
}

async function list(conditions = {}, sort = '', fields = '') {
    return Student.find(conditions)
        .select(fields)
        .sort(sort)
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

async function uploadSillyVideo(user, file) {
    const project = {
        name: `${user.name.first}'s Silly Video`,
        user: user._id,
        steps: [{
            title: 'My first video upload',
            video: file,
        }],
        public: true,
    };
    await Projects.create(project);
    await progress(user, 'sillyVideo');
    return true;
}

module.exports = {
    create,
    update,
    list,
    remove,
    findById,
    findOne,
    markDeleted,
    progress,
    uploadSillyVideo,
};
