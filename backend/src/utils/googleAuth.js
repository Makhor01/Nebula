const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel"); // Модель пользователя
require('dotenv').config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL, // Используйте переменную окружения
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Поиск пользователя по Google ID
                let user = await User.findOne({ where: { email: profile.emails[0].value } });

                // Если пользователь не найден, создаем его
                if (!user) {
                    user = await User.create({
                        email: profile.emails[0].value,
                        password: null, // Пароль не нужен для Google OAuth
                    });
                }

                done(null, user); // Передаем пользователя дальше
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
