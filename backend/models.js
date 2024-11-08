const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,  // Удаляет пробелы в начале и конце
        minlength: 3,  // Минимальная длина
        maxlength: 20  // Максимальная длина
    },
    password: { 
        type: String, 
        required: true 
    }
});

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User ' },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Объявляем модели
const User = mongoose.model('User ', userSchema);
const Message = mongoose.model('Message', messageSchema);
const Post = mongoose.model('Post', postSchema);

// Экспортируем модели
module.exports = { User, Message, Post };