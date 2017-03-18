var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'mysql.eecs.oregonstate.edu',
  user            : 'cs290_lisst',
  password        : '9GiantRobots',
  database        : 'cs290_lisst'
});

module.exports.pool = pool;
