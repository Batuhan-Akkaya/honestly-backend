const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    friends: [
        {
            _id: false,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    image: String,
    created: {
        type: Date,
        default: Date.now
    },
    notificationToken: String
});

module.exports = mongoose.model('User', UserSchema);
