const mongoose = require('mongoose');
const User = require('./user');

const { Schema } = mongoose;

const StudentSchema = new Schema({
  bio: {
    type: String,
    trim: true,
  },
  birthDate: {
    type: Date,
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
  year: {
    type: String,
  },

  engagement: {
    type: String,
  },

  studentId: {
    type: String,
    trim: true,
  },

  parentName: {
    type: String,
    trim: true,
  },

  gender: {
    type: String,
    enum: ['m', 'f'],
  },

  class: {
    type: String,
    trim: true,
  },

  section: {
    type: String,
    trim: true,
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
      timestamp: {
        type: Date,
        required: true,
        default: Date.now,
      },
      badge: {
        type: Schema.Types.ObjectId,
        ref: 'Badge',
        required: true,
      },
      mission: {
        type: Schema.Types.ObjectId,
        ref: 'Mission',
        default: null,
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

  participations: {
    type: [{
      post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
      },
      participated: {
        type: Date,
        default: Date.now,
        required: true,
      },
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

  mentor: {
    type: Boolean,
    default: false,
    required: true,
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
      home: {
        type: Boolean,
        default: false,
        required: true,
      },
      profile: {
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

StudentSchema.virtual('onBoarded').get(function onBoarded() {
  if (!this.progress) {
    return undefined;
  }
  const {
    welcome, bio, profilePicture, scoring, sillyVideo,
  } = this.progress;
  return welcome && bio && profilePicture && scoring && sillyVideo;
});

module.exports = User.discriminator('Student', StudentSchema);
