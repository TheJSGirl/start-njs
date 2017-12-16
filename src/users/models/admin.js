const mongoose = require('mongoose');
const User = require('./user');

const { Schema } = mongoose;

const AdminSchema = new Schema({
  challenges: {
    type: Boolean,
  },
  students: {
    type: Boolean,
  },
}, { strict: true });

module.exports = User.discriminator('Admin', AdminSchema);
