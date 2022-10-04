
const mysql = require('mysql');

const config = require("../config.json");
console.log('config', config)
// My Sql connect
let connection = mysql.createConnection(config.mysql);
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

const execute = async (sql, params) => {
  return new Promise(resolve => {
    // const query = `SELECT COUNT(*) AS count FROM users`;
    connection.query(sql, (err, result) => {
      if (err) {
        resolve({ err });
      } else {
        resolve(result)
      }
    });
  })
}


module.exports = {
  connection,
  execute
};



// module.export mysql;
// connection.end(function (err) {
//   if (err) {
//     return console.log('error:' + err.message);
//   }
//   console.log('Close the database connection.');
// });