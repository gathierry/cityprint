var dbConnection = require('./db');

var cityTable = 'city_table'; // table name for city in db
var visitTable = 'visit_table';

function City(cityname, country, latitude, longitude) {
	this.cityname = cityname; // string
	this.country = country;
	this.latitude = latitude;
	this.longitude = longitude;
	this.cid = latitude + ',' + longitude;
}

module.exports = City;

City.prototype.save = function save(callback) {
    // save city info into db
	var city = {cityname: this.cityname,
	             country: this.country,
		        latitude: this.latitude,
		       longitude: this.longitude,
		             cid: this.cid
	};
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + cityTable + ' (cid VARCHAR(30) PRIMARY KEY, cityname VARCHAR(30), country VARCHAR(30), latitude FLOAT, longitude FLOAT)', function(err) {
		if (err) {
			return callback(err);
		}
		dbConnection.query('INSERT IGNORE INTO ' + cityTable + ' SET ?', city, function(err) {
			callback(err);
		});
	});	
};

City.get = function get(cids, callback) {
	// get info of a user
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + cityTable + ' (cid VARCHAR(30) PRIMARY KEY, cityname VARCHAR(30), country VARCHAR(3), latitude FLOAT, longitude FLOAT)', function(err) {
		if (err) {
			return callback(err);
		}
		dbConnection.query('SELECT * FROM ' + cityTable + ' WHERE `cid` in (?)', [cids], function (err, results1) {
			if (err) {
				return callback(err);
			}
			dbConnection.query('SELECT COUNT(DISTINCT country) FROM ' + cityTable + ' WHERE `cid` in (?)', [cids], function (err, results2) {
				if (err) {
					return callback(err);
				}
				callback(err, results1, results2);
			});
	    });
	});
};

City.prototype.getImpressions = function getImpressions(username, callback) {
	var cid = this.cid;
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + visitTable + ' (username VARCHAR(30), cid VARCHAR(30), time DATE, impression TEXT, imptime DATE, PRIMARY KEY (username, cid))', function(err) {
		if (err) {
			return callback(err, null);
		}
		dbConnection.query('SELECT username, impression, imptime FROM ' + visitTable + ' WHERE `cid` = ? AND LENGTH(impression)>0 AND `username` <> ? ORDER BY imptime LIMIT 3', [cid, username], function (err, results2) {
			if (err) {
				return callback(err);
			}
			dbConnection.query('SELECT username, impression, imptime FROM ' + visitTable + ' WHERE `cid` = ? AND `username` = ?', [cid, username], function (err, results1) {
				if (err) {
					return callback(err);
				}
				return callback(err, results1.concat(results2));
		    });
	    });
	});
	
	
}