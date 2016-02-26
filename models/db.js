var mysql      = require('mysql');
var dbhost = process.env.OPENSHIFT_MYSQL_DB_HOST;
//var dbport = process.env.OPENSHIFT_MYSQL_DB_PORT;
var dbuser = process.env.OPENSHIFT_MYSQL_DB_USERNAME;
var dbpass = process.env.OPENSHIFT_MYSQL_DB_PASSWORD;

if (typeof dbhost === "undefined") {
	dbhost = 'localhost';
	dbuser = 'root';
	dbpass = 'sqlpass';
}

var connection = mysql.createConnection({
	host     : dbhost,
	user     : dbuser,
	password : dbpass,
	database : 'cityprint'
});
module.exports = connection;