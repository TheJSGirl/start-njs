const mongoose = require('mongoose');
const User = require('./user');

const { Schema } = mongoose;

const MentorSchema = new Schema({
  bio: {
    type: String,
    trim: true,
  },
  center: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Center',
  },
  batch: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Batch',
  },

  gender: {
    type: String,
    enum: ['m', 'f'],
    required: true,
  },

  knowls: {
    type: Number,
    required: true,
    default: 0,
  },

  dibbs: {
    type: Number,
    required: true,
    default: 0,
  },

  badgesEarned: {
    type: [{
      badge: {
        type: Schema.Types.ObjectId,
        ref: 'Badge',
        required: true,
      },
      seen: {
        type: Boolean,
        default: false,
        required: true,
      },
    }],
    default: [],
  },

  challengesCompleted: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
    }],
    default: [],
  },

  levelsCompleted: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Level',
    }],
    default: [],
  },

  follows: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },

  progress: {
    type: {
      welcome: {
        type: Boolean,
        default: false,
        required: true,
      },
      bio: {
        type: Boolean,
        default: false,
        required: true,
      },
      profilePicture: {
        type: Boolean,
        default: false,
        required: true,
      },
      scoring: {
        type: Boolean,
        default: false,
        required: true,
      },
      sillyVideo: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    required: true,
    default: {
      welcome: false, bio: false, profilePicture: false, scoring: false, sillyVideo: false,
    },
  },
}, { strict: true });

MentorSchema.virtual('onBoarded').get(function onBoarded() {
  const {
    welcome, bio, profilePicture, scoring, sillyVideo,
  } = this.progress;
  return welcome && bio && profilePicture && scoring && sillyVideo;
});

module.exports = User.discriminator('Mentor', MentorSchema);
