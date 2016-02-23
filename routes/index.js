User = require('../models/user.js');

var express = require('express');
var crypto = require('crypto');
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
	res.render('login');
});

router.post('/login', function(req, res, next) {
    var username = req.body.username;
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	var jsonResp = {username : username, errcode : 1}; // errcode 0 - success, 1 - db error, 2 - user inexist, 3 - password incorrect
	User.get(username, function(err, user) {
	    if (err) {
			throw(err);
			res.json(jsonResp);
	    	return res.redirect('/login');
	    }
		if (!user) {
			jsonResp.errcode = 2;
			res.json(jsonResp);
			console.log('User not exist');
		}
		else if (user.password != password) {
			jsonResp.errcode = 3;
			res.json(jsonResp);
			console.log('Wrong password');
		}
		else {
			req.session.user = username;
			jsonResp.errcode = 0;
			res.json(jsonResp);
			//return res.redirect('/');
		}
	});
	
});

// check if username exist
router.get('/checkusername', function(req, res, next) {
	var username = req.query.username;
	var jsonResp = {username : username, errcode : 1}; // errcode 0 - not exist, 1 - db error, 2 - user exist
	User.exist(username, function(err, exist) {
	    if (err) {
			throw(err);
			res.json(jsonResp);
	    }
		if (!exist) {
			jsonResp.errcode = 0;
			res.json(jsonResp);
		} else {
			jsonResp.errcode = 2;
			res.json(jsonResp);
		}
	});
});

router.post('/reg', function(req, res, next) {
    var username = req.body.username;
	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');
	
	var jsonResp = {username : username, errcode : 1}; // errcode 0 - not exist, 1 - db error, 2 - user exist
	User.exist(username, function(err, exist) {
	    if (err) {
			throw(err);
			res.json(jsonResp);
	    }
		if (!exist) {
			jsonResp.errcode = 0;
			var newUser = new User(username, password);
			newUser.save(function(err) {
			    if (err) {
					throw(err);
			    	res.json(jsonResp);
			    }
				req.session.user = username;
				res.json(jsonResp);
			});
		} else {
			jsonResp.errcode = 2;
			res.json(jsonResp);
		}
	});
});

router.get('/logout', function(req, res, next) {
	req.session.user = null;
	return res.redirect('/');
});

module.exports = router;
