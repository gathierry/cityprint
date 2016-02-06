var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'sqlpass',
	database : 'cityprint'
});
module.exports = connection;