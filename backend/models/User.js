const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    password: { 
        type: String, 
        required: true 
    }
});

const User = mongoose.model('User', userSchema); // Убрал пробел после 'User'

module.exports = User;