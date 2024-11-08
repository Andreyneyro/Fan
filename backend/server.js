require('dotenv').config(); // Добавьте в начало файла
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/messenger')
    .then(() => {
        console.log('Подключение к MongoDB успешно!');
    })
    .catch(err => {
        console.error('Ошибка подключения к MongoDB:', err);
    });

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

// Настройка обслуживания статических файлов из папки frontend
app.use(express.static(path.join(__dirname, '../frontend'))); 

// Добавление маршрута для корневого URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});