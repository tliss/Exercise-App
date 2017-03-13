var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'samort7',
  password        : 'taylor',
  database        : 'workout_tracker'
});

module.exports.pool = pool;
