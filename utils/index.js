const crypto = require('crypto');
const axios = require('axios');
const chance = require('chance').Chance();

function removeIdFields(data) {
    if (data.id) {
        delete data.id;
    }
    if (data._id) {
        delete data._id;
    }
}

function md5Hash(string) {
    const md5Sum = crypto.createHash('md5');

    if (!string) {
        string = module.exports.randomString();
    }

    md5Sum.update(string);

    return md5Sum.digest('hex');
}

function randomString(lenght, charset) {
    const options = {};

    if (lenght) {
        options.length = lenght;
    }

    if (charset) {
        options.pool = charset;
    }

    return chance.string(options);
}

function formatProfileResponse(user) {
    const res = {
        id: user.id,
        name: user.name,
        username: user.username,
        gender: user.gender,
        batch: user.batch,
        center: user.center,
        onBoarded: user.onBoarded,
        knowls: user.knowls,
        dibbs: user.dibbs,
        bio: user.bio,
        year: user.year,
        image: user.image || undefined,
        video: user.video || undefined,
        badgesEarned: user.badgesEarned,
        follows: user.follows,
        progress: user.progress,
        imageUrl: user.imageUrl,
        videoUrl: user.videoUrl,
        levelsCompleted: user.levelsCompleted,
        challengesCompleted: user.challengesCompleted,
        mentor: user.mentor,
        participations: user.participations,
    };

    user = user.toJSON();
    res.name.full = user.name.full;

    return res;
}

function generateUsername({ first, last }) {
    let username = `${first}`.toLowerCase().replace(/\s/ig, '');
    if (last.trim()) {
        username += `.${last.trim().substr(0, 2).toLowerCase()}`;
    }

    return username;
}

module.exports = {
    md5Hash,
    randomString,
    removeIdFields,
    formatProfileResponse,
    generateUsername,
};
