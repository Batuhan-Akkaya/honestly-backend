const AuthController = require('./controllers/auth');

const express = require('express');

module.exports = function (app) {
    const apiRoutes = express.Router(),
        authRoutes = express.Router();

    apiRoutes.use('/auth', authRoutes);
    authRoutes.post('/register', AuthController.register);
    authRoutes.post('/login', AuthController.login);

    app.use('/api', apiRoutes);
};
