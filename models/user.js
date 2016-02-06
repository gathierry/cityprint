var dbConnection = require('./db');

var userTable = 'user_table' // table name for users in db

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
	var query = dbConnection.query('CREATE TABLE IF NOT EXISTS ' + userTable + ' (username VARCHAR(30) PRIMARY KEY, password VARCHAR(30))');
	query = dbConnection.query('INSERT INTO ' + userTable + ' SET ?', user, function(err) {
		dbConnection.end();
		callback(err);
	});
};

User.get = function get(username, callback) {
	// get info of a user
};