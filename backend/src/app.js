const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const passport = require('passport');
const app = express();
const helmet = require('helmet');
const yandexStrategy = require('./utils/yandexAuth');
require('dotenv').config();
// Настройка CSP
// Инициализация Passport
app.use(passport.initialize());

// Подключение стратегии Яндекс OAuth
passport.use(yandexStrategy);


app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // Разрешить загрузку ресурсов только с вашего домена
            fontSrc: ["'self'", 'http://localhost:4000', 'data:'], // Разрешить загрузку шрифтов
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Разрешить выполнение скриптов
            styleSrc: ["'self'", "'unsafe-inline'"], // Разрешить загрузку стилей
            imgSrc: ["'self'", 'data:', 'http://localhost:4000'], // Разрешить загрузку изображений
            connectSrc: ["'self'", 'http://localhost:4000'], // Разрешить запросы к вашему серверу
        },
    })
);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);

module.exports = app;