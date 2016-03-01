User = require('../models/user.js');
City = require('../models/city.js');

var express = require('express');
var crypto = require('crypto');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.user == null) {
		return res.redirect('/login');
	}
	// write location to database
	res.render('map', { title: 'Cityprint', username: req.session.user });
});

router.get('/visit', function(req, res, next) {
	var cityname = req.query.cityname;
	var country = req.query.country;
	var latitude = req.query.lat;
	var longitude = req.query.lng;
	var city = new City(cityname, country, latitude, longitude);
	var username = req.session.user;
	var user = new User(username, '');
	var pathwayCid = [];
	user.visit(city, new Date(), '', function(err, results) {
		if (err) {
			throw(err);
		}
		for (var i = 0; i < results.length; i ++) {
			pathwayCid.push(results[i]['cid']);
		}
		City.get(pathwayCid, function(err, cities, country) {
			if (err) {
				throw(err);
			}
			var nbCountry = country[0]['COUNT(DISTINCT country)'];
			var nbCity = cities.length;
			city.getImpressions(username, function(err, imps) {
				request('https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=' + cityname, 
				function (err, resp1, body1) {
					var cityExtract = '';
				    if (!err && resp1.statusCode == 200) {
					    var pageid = Object.keys(JSON.parse(body1).query.pages)[0];
						if (typeof JSON.parse(body1).query.pages[pageid].extract != "undefined") {
							cityExtract = JSON.parse(body1).query.pages[pageid].extract;
						}
				    }
	  			    request('http://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=200&titles=' + cityname, 
	  			    function (err, resp2, body2) {
						var imgLink = '';
	  			        if (!err && resp2.statusCode == 200) {
	  				        var pageid = Object.keys(JSON.parse(body2).query.pages)[0]
							if (typeof JSON.parse(body2).query.pages[pageid].thumbnail != "undefined") {
								imgLink = JSON.parse(body2).query.pages[pageid].thumbnail.source;
							}
	  			        }
						var pathway = {cities : cities, nbCountry : nbCountry, nbCity : nbCity};
						console.log({pathway : pathway, extract : cityExtract, img : imgLink, impression : imps});
				        res.json({pathway : pathway, extract : cityExtract, img : imgLink, impression : imps});
	  			    });
				});
			});
		});
	});
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
