const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    if (!req.session || !req.session.authenticated) {
        res.redirect('/users');
    } else {
        res.render('index', {title: 'Authenticated', user: req.session.user.name, count: req.session.user.clicks});
    }
});

module.exports = router;
