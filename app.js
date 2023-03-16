// const createError = require('http-errors');
const express = require('express');
const cors = require('cors');

const indexRouter = require('./routes/index');

require('dotenv').config();

const app = express();

app.use(express.json({ limit: '50gb' }));
app.use(express.urlencoded({
    extended: false,
    limit: '50gb'
}));
app.use(cors());
// Enable CORS

app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,AuthorizationToken, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    // res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
    // next(createError(404));
    const message = 'Unknown endpoint.';
    return res.status(404).json({
        message
    });
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
