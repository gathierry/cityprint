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
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + userTable + ' (username VARCHAR(30) PRIMARY KEY, password VARCHAR(30))', function(err) {
		if (err) {
			return callback(err);
		}
		dbConnection.query('INSERT INTO ' + userTable + ' SET ?', user, function(err) {
			if (err) {
				return callback(err);
			} else {
				callback(err);
			}
		});
	});
	
};

User.exist = function exist(username, callback) {
	var query = dbConnection.query('SELECT COUNT(*) FROM ' + userTable + ' WHERE `username` = ?', username, function(err, results) {
		if (err) {
			return callback(err, null);
		}
		if (results[0]['COUNT(*)'] > 0) {
			return callback(err, true);
		} else {
			return callback(err, false);
		}
	});
}

User.get = function get(username, callback) {
	// get info of a user
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + userTable + ' (username VARCHAR(30) PRIMARY KEY, password VARCHAR(30))', function(err) {
		if (err) {
			return callback(err);
		}
		dbConnection.query('SELECT * FROM ' + userTable + ' WHERE `username` = ?', username, function (err, results, fields) {
			if (results.length > 0) { // user exist
				var user = new User(results[0].username, results[0].password);
				callback(err, user);
			} else { // user not exist
				callback(err, null);
			}
	    });
	});
};

User.prototype.visit = function visit(city, time, impression, callback) {
	city.save(function(err) {
		if (err) {
			throw(err);
		}
	});
	
	var visit = {username: this.username,
		              cid: city.cid,
		             time: time,
		       impression: impression,
		          imptime: time
	};
	var username = this.username;
	
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + visitTable + ' (username VARCHAR(30), cid VARCHAR(30), time DATE, impression VARCHAR(30), imptime DATE, PRIMARY KEY (username, cid))', function(err) {
		if (err) {
			return callback(err, null);
		}
		dbConnection.query('INSERT IGNORE INTO ' + visitTable + ' SET ?', visit, function(err) {
			if (err) {
				return callback(err, null);
			}
			dbConnection.query('SELECT * FROM ' + visitTable + ' WHERE `username` = ?', username, function (err, results) {
				if (err) {
					return callback(err, null);
				}
				callback(err, results);
		    });
		});
	});
};

User.prototype.updateImpression = function updateImpression(cid, imptime, impression, callback) {
	var username = this.username;
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + visitTable + ' (username VARCHAR(30), cid VARCHAR(30), time DATE, impression VARCHAR(30), imptime DATE, PRIMARY KEY (username, cid))', function(err) {
		if (err) {
			return callback(err, null);
		}
		dbConnection.query('UPDATE ' + visitTable + ' SET `impression`=? WHERE `username`=? and`cid`=?', [impression, username, cid], function(err) {
			if (err) {
				return callback(err, null);
			}
			return callback(err);
		});
	});
};

