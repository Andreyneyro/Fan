const express = require('express');
const controllers = require('./controllers');
const authMiddleware = require('./middleware/auth');

const router = express.Router();

// Защищенные маршруты, требующие авторизации
router.get('/profile', authMiddleware, controllers.getUserProfile);
router.post('/posts', authMiddleware, controllers.createPost);
router.get('/posts', authMiddleware, controllers.getPosts);

// Маршруты без авторизации
router.post('/register', controllers.registerUser );
router.post('/login', controllers.loginUser );
router.get('/user', authMiddleware, controllers.getUserData);

module.exports = router;