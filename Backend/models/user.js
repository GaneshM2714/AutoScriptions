const mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    'username': String,
    'emailid': String,
    'phone': Number,
    'account': Number,
    'password': String,
    'preferences': {
        type: Object,
        default: {}
    }
}, {timestamps: true});

module.exports = mongoose.model('user', userSchema);
