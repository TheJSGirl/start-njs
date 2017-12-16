const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const plugins = require('mongoose-plugins');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: {
      first: {
        type: String,
        trim: true,
        default: '',
        required: true,
      },
      last: {
        type: String,
        trim: true,
        default: '',
        required: true,
      },
    },
  },

  mobile: {
    type: Number,
    trim: true,
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
  },

  image: {
    type: String,
    trim: true,
  },

  video: {
    type: String,
    trim: true,
  },

  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
  },

  verificationKeys: {
    type: {
      email: {
        type: String,
        trim: true,
        default: '',
      },
      forgotPassword: {
        type: String,
        trim: true,
        default: '',
      },
    },
  },

  active: {
    type: Boolean,
    default: false,
    required: true,
  },

  deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
}, {
  strict: true,
  timestamps: { createdAt: 'created', updatedAt: 'modified' },
  hide: 'password verificationKeys',
  discriminatorKey: '_type',
});


UserSchema.methods.comparePassword = function comparePassword(pass) {
  return bcrypt.compareSync(pass, this.password);
};

UserSchema.methods.isAdmin = function isAdmin() {
  return this._type.toLowerCase() === 'admin';
};

UserSchema.methods.isStudent = function isStudent() {
  return this._type.toLowerCase() === 'student';
};

UserSchema.methods.isMentor = function isMentor() {
  return this._type.toLowerCase() === 'mentor';
};

UserSchema.virtual('imageUrl').get(function getUrl() {
  if (!this.image) {
    return undefined;
  }
  if (this.image.indexOf('http') === 0) {
    return this.image;
  }
  return `https://${bucketToUse}.s3.amazonaws.com/${this.image}`;
});

UserSchema.virtual('videoUrl').get(function getUrl() {
  if (!this.video) {
    return undefined;
  }
  return `https://${bucketToUse}.s3.amazonaws.com/${this.video}`;
});

UserSchema.virtual('name.full').get(function fullName() {
  const { first, last } = this.name;
  return `${first || ''} ${last || ''}`.trim();
});

UserSchema.pre('save', function hashPassword(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  return next();
});


module.exports = mongoose.model('User', UserSchema);
