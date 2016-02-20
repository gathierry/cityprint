User = require('../models/user.js');

var express = require('express');
var crypto = require("crypto");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.user == null) {
		return res.redirect('/login');
	}
	// write location to database
	res.render('index', { title: 'Cityprint', username: req.session.user });
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
    var username = "testuser5";
	var md5 = crypto.createHash('md5');
	var password = md5.update("00000000").digest('base64');
	User.get(username, function(err, user) {
	    if (err) {
			throw(err);
	    	return res.redirect('/login');
	    }
		if (!user) {
			console.log('User not exist');
			return res.redirect('/login');
		}
		if (user.password != password) {
			console.log('Wrong password');
			return res.redirect('/login');
		}
		req.session.user = username;
		return res.redirect('/');
	})
	
});

router.get('/reg', function(req, res, next) {
	res.render('login', { title: 'Register' });
});

router.post('/reg', function(req, res, next) {
    var username = "testuser5";
	var md5 = crypto.createHash('md5');
	var password = md5.update("00000000").digest('base64');
	var newUser = new User(username, password);
	newUser.save(function(err) {
	    if (err) {
			throw(err);
	    	return res.redirect('/reg');
	    }
		req.session.user = username;
		res.redirect('/');
	});
});

router.get('/logout', function(req, res, next) {
	req.session.user = null;
	return res.redirect('/');
});

module.exports = router;
