
const mysql = require('mysql');

// My Sql connect
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'presale'
});
const util = require('util');
console.log('mysql connect')
// connection.connect(function (err) {
//   if (err) {
//     return console.error('error: ' + err.message);
//   }
//   return connection;
//   console.log('Connected to the MySQL server.');
// });
// exports.query = util.promisify(connection.query).bind(connection);
connection.connect();

module.exports = connection;
// module.export mysql;
// connection.end(function (err) {
//   if (err) {
//     return console.log('error:' + err.message);
//   }
//   console.log('Close the database connection.');
// });