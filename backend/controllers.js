const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/User'); // Используйте 'User ' везде
const PostModel = require('./models/Post'); // Импортируйте только один раз
const MessageModel = require('./models/Message');

// Остальной код контроллера...

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};

const registerUser  = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Проверка существования пользователя перед регистрацией
        const existingUser  = await UserModel.findOne({ username });
        if (existingUser ) {
            return res.status(400).send('Пользователь с таким именем уже существует');
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new UserModel({ username, password: hashedPassword });
        await user.save();
        
        res.status(201).send('Пользователь зарегистрирован');
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        
        // Обработка ошибки дублирования ключа
        if (error.code === 11000) {
            return res.status(400).send('Пользователь с таким именем уже существует');
        }
        
        res.status(500).send('Ошибка сервера при регистрации');
    }
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_very_strong_and_consistent_secret_key';

const loginUser  = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await UserModel.findOne({ username });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Неверные учетные данные' });
        }
        
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера при входе' });
    }
};

const sendMessage = async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const message = new MessageModel({ 
            sender: req.user.id, 
            receiver: receiverId, 
            content 
        });
        await message.save();
        res.status(201).send('Сообщение отправлено');
    } catch (error) {
        console.error('Ошибка отправки сообщения:', error);
        res.status(500).send('Ошибка сервера при отправке сообщения');
    }
};

const getUserProfile = async (req, res) => {
    try {
        // Проверяем, что пользователь авторизован
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Находим пользователя по ID из токена
        const user = await UserModel.findById(req.user.id).select('username');
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Возвращаем профиль
        res.json({ 
            username: user.username,
        });
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const posts = await PostModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        console.error('Ошибка получения постов:', error);
        res.status(500).send('Ошибка сервера при получении постов');
    }
};

const createPost = async (req, res) => {
    try {
        const { content } = req.body;
        
        // Проверка наличия контента
        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Содержание поста не может быть пустым' });
        }

        const post = new PostModel({ 
            user: req.user.id, 
            content 
        });
        
        await post.save();
        
        res.status(201).json({
            id: post ._id,
            content: post.content,
            createdAt: post.createdAt
        });
    } catch (error) {
        console.error('Ошибка создания поста:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при создании поста',
            error: error.message 
        });
    }
};

const getPosts = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const posts = await PostModel.find()
            .sort({ createdAt: -1 })
            .populate('user', 'username');

        res.json({
            posts: posts.map(post => ({
                id: post._id,
                content: post.content,
                username: post.user.username,
                createdAt: post.createdAt
            }))
        });
    } catch (error) {
        console.error('Ошибка получения постов:', error);
        res.status(500).json({ 
            message: 'Ошибка сервера при получении постов', 
            error: error.message 
        });
    }
};

const getUserData = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select('username');
        
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ username: user.username });
    } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Добавьте в экспорт
module.exports = { 
    registerUser , 
    loginUser , 
    sendMessage, 
    getUserProfile, 
    getUserPosts,
    getPosts,
    createPost,
    getUserData 
};