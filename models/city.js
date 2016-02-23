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
	dbConnection.connect();
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + cityTable + ' (cid VARCHAR(30) PRIMARY KEY, cityname VARCHAR(30), country VARCHAR(30), latitude FLOAT, longitude FLOAT)', function(err) {
		if (err) {
			dbConnection.end();
			return callback(err);
		}
	});
	query = dbConnection.query('INSERT INTO ' + cityTable + ' SET ?', city, function(err) {
		dbConnection.end();
		callback(err);
	});
};

City.get = function get(cid, callback) {
	// get info of a user
	dbConnection.connect();
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + cityTable + ' (cid VARCHAR(30) PRIMARY KEY, cityname VARCHAR(30), country VARCHAR(30), latitude FLOAT, longitude FLOAT)', function(err) {
		if (err) {
			dbConnection.end();
			return callback(err);
		}
	});
	query = dbConnection.query('SELECT * FROM ' + cityTable + ' WHERE `cid` = ?', cid, function (err, results, fields) {
		dbConnection.end();
		if (results.length > 0) { // city exist
			var city = new City(results[0].cityname, results[0].country, results[0].latitude, results[0].longitude);
			callback(err, city);
		}
		else { // city not exist
			callback(err, null);
		}
    });
};

