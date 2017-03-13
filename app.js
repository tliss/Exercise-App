//*****Express stuff*********
var express = require('express');
var app = express();
app.use(express.static('public'));

//*****Handlebars stuff******
//Create instance of handlebars let it know default layout is 'main'
//Default layout is the area all the other contents will be inserted
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
//.handlebars extensions are managed by handlebars
app.engine('handlebars', handlebars.engine);
//Lets us ignore .handlebars extensions
app.set('view engine', 'handlebars');

var helpers = require('handlebars-helpers')();

//*****MySQL stuff******
var mysql = require('./mysql.js');

app.set('port', 8080);

//*****Main Page*************

app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM exercises', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.results = JSON.stringify(rows);
    console.log("\n------------------\ncontext is\n------------------")
    console.log(JSON.stringify(context, null, 4));
    
    context.rows = rows;
    console.log("\n------------------\nrows is\n------------------")
    console.log(JSON.stringify(rows, null, 4));
    
    console.log("\n------------------\ncontext.rows is\n------------------")
    console.log(JSON.stringify(context.rows, null, 4));
    
    //console.log(rows[0].id);
    
//    for (var i = 0; i < context.results.length; i++) {
//        var name = context.results[i].name;
//        context.script += "<script></script>"
//    }
    
    res.render('home', context);
  });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE DEFAULT GETDATE(),"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    });
  });
});

//*****Error Handling********
app.use(function(req,res){
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.send('500 - Server Error');
});
//***************************

app.listen(app.get('port'), function(){
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});