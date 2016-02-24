var dbConnection = require('./db');

var cityTable = 'city_table'; // table name for city in db

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
	});
	
	dbConnection.query('INSERT IGNORE INTO ' + cityTable + ' SET ?', city, function(err) {
		callback(err);
	});
};

City.get = function get(cids, callback) {
	// get info of a user
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + cityTable + ' (cid VARCHAR(30) PRIMARY KEY, cityname VARCHAR(30), country VARCHAR(30), latitude FLOAT, longitude FLOAT)', function(err) {
		if (err) {
			return callback(err);
		}
	});
	query = dbConnection.query('SELECT * FROM ' + cityTable + ' WHERE `cid` in (?)', [cids], function (err, results, fields) {
		if (err) {
			return callback(err);
		}
		callback(err, results);
    });
};