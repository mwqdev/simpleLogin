const express = require('express');
const router = express.Router();

const userData = require('../data/users');

let defaultUser = 'guest';

router.get('/', function (req, res) {
    res.render('signin');
});

router.post('/', (req, res) => {
    let name = req.body.username;
    let password = req.body.password;

    let user = userData.users.find(q => q.name === name && q.password === password);

    if (!user) {
        // only for 'user not found' error message
        defaultUser = null;
        res.redirect('/users/signup');
    } else {
        req.session.user = user;
        req.session.authenticated = true;
        res.redirect('/');
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Authentication', user: defaultUser});
    // reset defaultUser to clear error message
    defaultUser = 'guest';
});

router.post('/signup', (req, res) => {
    req.check('username', 'Username must be at least 4 characters')
        .isLength({min: 4});
    req.check('username', 'Username may only contain alphanumeric characters')
        .isAlphanumeric();
    req.check('password', 'Passwords must match')
        .equals(req.body.confirmPassword);
    req.check('password', 'Password must be at least 6 characters')
        .isLength({min: 6});

    let errors = req.validationErrors();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;

        res.render('signup', {
            title: 'Authentication',
            errors: req.session.errors,
            user: defaultUser
        });

        req.session.errors = null;
    } else {
        req.session.success = true;

        let user = {
            name: req.body.username,
            password: req.body.password,
            clicks: 0
        };

        userData.users.push(user);

        res.redirect('/users');
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/counter', (req, res) => {
    req.session.user.clicks++;
    res.render('index', {title: 'Authenticated', user: req.session.user.name, count: req.session.user.clicks});
    res.end();
});

module.exports = router;
