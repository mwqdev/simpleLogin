const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const expressValidator = require('express-validator');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(expressSession({secret: 'doublesecretprobation', saveUninitialized: true, resave: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

app.listen(3000, () => {
    console.log('Listening on 3000');
});