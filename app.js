require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('./config/cors.config');
const passportConfig = require('./config/passport.config');
const session = require('./config/session.config');

/**
 * DB config
 */
require('./config/db.config');

/**
 * Configure express
 */
const app = express();
app.use(cors);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session);
app.use(passportConfig);


app.use((req, _, next) => {
    req.currentUser = req.session.user
    next()
})

/**
 * Configure routes
 */
const router = require('./config/routes/index.routes');
const usersRouter = require("./config/routes/users.routes")
const eventsRouter = require("./config/routes/events.routes")
app.use('/', router)
app.use('/users', usersRouter)
app.use('/events', eventsRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (error, req, res, next) {
    console.error(error);

    res.status(error.status || 500);

    const data = {}

    if (error instanceof mongoose.Error.ValidationError) {
        res.status(400);
        for (field of Object.keys(error.errors)) {
            error.errors[field] = error.errors[field].message
        }
        data.errors = error.errors
    } else if (error instanceof mongoose.Error.CastError) {
        error = createError(404, 'Resource not found')
    }

    data.message = error.message;
    res.json(data);
});

/** 
 * Listen on provided port
 */
const port = normalizePort(process.env.PORT || '5000');
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

// Helper functions

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}