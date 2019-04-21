const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const router = require('./router');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const local = true;

app.get('/' , (req, res) => {
    res.send('HONESTLY');
});

const mongoHost = local ? `'mongodb://localhost:27017/test-game` : `mongodb://${config.dbUser}:${config.dbPassword}@${config.host}:${config.port}/${config.db}`;
mongoose.connect(mongoHost, { useNewUrlParser: true , useCreateIndex: true});
router(app);

app.use(function(req, res, next) {
    next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
