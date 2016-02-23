var dbConnection = require('./db');

var userTable = 'user_table'; // table name for users in db
var visitTable = 'visit_table';

function User(username, password) {
	this.username = username; // string
	this.password = password; // crypted string
}

module.exports = User;

User.prototype.save = function save(callback) {
    // save user info after register into db
	var user = {username: this.username,
	            password: this.password
	};
	dbConnection.connect();
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + userTable + ' (username VARCHAR(30) PRIMARY KEY, password VARCHAR(30))', function(err) {
		if (err) {
			dbConnection.end();
			return callback(err, null);
		}
	});
	
	query = dbConnection.query('SELECT * FROM ' + userTable + ' WHERE `username` = ?', username, function (err, results, fields) {
		if (results.length > 0) { // user already exist
			var user = new User(results[0].username, results[0].password);
			dbConnection.end();
			callback(err, true);
		}
		else {
			dbConnection.query('INSERT INTO ' + userTable + ' SET ?', user, function(err) {
				dbConnection.end();
				callback(err, false);
			});
		}
    });
};

User.get = function get(username, callback) {
	// get info of a user
	dbConnection.connect();
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + userTable + ' (username VARCHAR(30) PRIMARY KEY, password VARCHAR(30))', function(err) {
		if (err) {
			dbConnection.end();
			return callback(err);
		}
	});
	query = dbConnection.query('SELECT * FROM ' + userTable + ' WHERE `username` = ?', username, function (err, results, fields) {
		dbConnection.end();
		if (results.length > 0) { // user exist
			var user = new User(results[0].username, results[0].password);
			callback(err, user);
		}
		else { // user not exist
			callback(err, null);
		}
    });
};

User.prototype.visit = function visit(city, time, impression) {
	city.save(function(err) {
		if (err) {
			throw(err);
		}
	});
	
	var visit = {username: this.username,
		              cid: city.cid,
		             time: time,
		       impression: impression	
	};
	
	dbConnection.connect();
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + visitTable + ' (username VARCHAR(30), cid VARCHAR(30), time DATE, impression VARCHAR(30), PRIMARY KEY (username, cid))', function(err) {
		if (err) {
			dbConnection.end();
			return callback(err);
		}
	});
	query = dbConnection.query('INSERT INTO ' + visitTable + ' SET ?', visit, function(err) {
		dbConnection.end();
		callback(err);
	});
};