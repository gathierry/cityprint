var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  //user     : 'dbuser',
  //password : 's3kreee7'
});
module.exports = connection;