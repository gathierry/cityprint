var express = require('express');
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
	// if log in
	// verify in db
	
	// if register
	// write to db
	req.session.user = req.body.username;
	return res.redirect('/');
});

router.get('/logout', function(req, res, next) {
	req.session.user = null;
	return res.redirect('/');
});

module.exports = router;
