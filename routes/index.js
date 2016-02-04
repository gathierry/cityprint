var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {
	req.session.user = req.body.username;
	return res.redirect('/summary');
});

router.get('/summary', function(req, res, next) {
  res.render('summary', { title: 'Summary',
                       username: req.session.user });
});

module.exports = router;
