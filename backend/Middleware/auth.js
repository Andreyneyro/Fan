const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_very_strong_and_consistent_secret_key';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            message: 'Токен не предоставлен',
            error: 'No authorization header'
        });
    }

    // Проверяем формат заголовка
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ 
            message: 'Неверный формат токена',
            error: 'Invalid authorization header format'
        });
    }

    const token = parts[1];

    if (!token) {
        return res.status(401).json({ 
            message: 'Токен отсутствует',
            error: 'Token is empty'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            // Дополнительные опции верификации
            algorithms: ['HS256'], // Укажите используемый алгоритм
            maxAge: '7d' // Максимальный срок действия токена
        });
        
        // Проверка времени жизни токена
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
            return res.status(401).json({ 
                message: 'Токен истек',
                error: 'Token has expired'
            });
        }

        // Добавляем дополнительную проверку структуры токена
        if (!decoded.id) {
            return res.status(401).json({ 
                message: 'Недействительный токен',
                error: 'Invalid token structure'
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        // Детальная обработка различных ошибок JWT
        let message = 'Недействительный токен';
        
        switch (error.name) {
            case 'JsonWebTokenError':
                message = 'Некорректный токен';
                break;
            case 'TokenExpiredError':
                message = 'Токен истек';
                break;
            case 'NotBeforeError':
                message = 'Токен еще не активен';
                break;
            default:
                message = 'Ошибка аутентификации';
        }

        return res.status(401).json({ 
            message: message,
            error: error.message,
            errorType: error.name
        });
    }
};

module.exports = authMiddleware;