const http = require('http');
const app = require('./app'); // Подключение основного приложения
require('dotenv').config(); // Подгружаем переменные окружения

// Установка порта из переменных окружения или по умолчанию
const PORT = process.env.PORT || 4000;

// Создаем HTTP сервер
const server = http.createServer(app);

// Запуск сервера
server.listen(PORT, () => {
    console.log(`Server is running on http://185.91.52.121:${PORT}`);
});
