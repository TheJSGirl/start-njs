const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    ipAddress: {
        type: String,
    },

    expires: {
        type: Date,
        default: () => {
            const date = new Date();
            date.setTime(date.getTime() + (30 * 24 * 3600 * 1000));
            return date;
        },
    },
});

module.exports = mongoose.model('AuthToken', TokenSchema);
