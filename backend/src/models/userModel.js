const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const usersFilePath = path.join(__dirname, 'data', 'users.json');

const readUsers = () => {
    try {
        if (!fs.existsSync(usersFilePath)) {
            throw new Error(`File not found: ${usersFilePath}`);
        }
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading users file: ${error.message}`);
        throw error; // Пробрасываем ошибку дальше
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const findUserByEmail = (email) => {
    const users = readUsers();
    return users.find(user => user.email === email);
};

const createUser = async (email, password) => {
    const users = readUsers();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        id: users.length + 1,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
};

module.exports = { findUserByEmail, createUser };