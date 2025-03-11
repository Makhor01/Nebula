const passport = require('passport');
const YandexStrategy = require('passport-yandex').Strategy;
const User = require('../models/userModel');

passport.use(
    new YandexStrategy(
        {
            clientID: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            callbackURL: process.env.YANDEX_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Поиск пользователя по email
                let user = await User.findOne({ where: { email: profile.emails[0].value } });

                // Если пользователь не найден, создаем его
                if (!user) {
                    user = await User.create({
                        email: profile.emails[0].value,
                        password: null, // Пароль не нужен для Яндекс OAuth
                    });
                }

                done(null, user); // Передаем пользователя дальше
            } catch (error) {
                done(error, null);
            }
        }
    )
);

module.exports = passport;