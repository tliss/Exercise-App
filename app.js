//*****Express stuff*********
var express = require('express');
var app = express();
app.use(express.static('public'));

//*****BodyParser stuff*******
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//*****Handlebars stuff******
//Create instance of handlebars let it know default layout is 'main'
//Default layout is the area all the other contents will be inserted
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
//.handlebars extensions are managed by handlebars
app.engine('handlebars', handlebars.engine);
//Lets us ignore .handlebars extensions
app.set('view engine', 'handlebars');

var helpers = require('handlebars-helpers')();
var moment = require('moment');

//*****MySQL stuff******
var mysql = require('./mysql.js');

app.set('port', 3000);

//*****Routes*************

app.get('/',function(req,res,next){
    var context = {};

    var subScript = "<script id=\"onStart\">window.addEventListener('load', function(){displayTable();});</script>";
    context.test = subScript;
    
    res.render('home', context);
});

app.post('/getTable',function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT * FROM exercises", function(err, rows, fields){
        if (err){
            next(err);
            return;
        }

        context.rows = rows;

        for (var row of context.rows){
            row.date = moment(row.date).format('MM/DD/YYYY');
        }

        res.send(JSON.stringify(context));
    });
});

app.post('/remove', function(req,res,next){
    
    mysql.pool.query("DELETE FROM exercises WHERE id=" + req.body.rowId, function(err, rows, fields){
        if (err){
            next(err);
            return;
        }
        res.send(null);
    });
});

app.get('/update', function(req,res){
//    var context = {};
//    context.tableID = req.ID;
//    context.element = req.element;

    res.render('update');
});

app.post('/notify',function(req,res,next){
    var context = {};
    var data = req.body;
//    var reject = false;
//    
//    for (var item in data){
//        if (item === null){
//            reject = true;
//        }
//    }
//    
//    if (reject === false) {
//        console.log("Invalid Entry");
//        //Fill this in later
//    } else {
    mysql.pool.query("INSERT INTO exercises SET ?", data, function(err, rows, fields){
        if (err){
            next(err);
            return;
        }
        mysql.pool.query("SELECT * FROM exercises", function(err, rows, fields){
            if (err){
                next(err);
                return;
            }

            context.rows = rows;

            for (var row of context.rows){
                row.date = moment(row.date).format('MM/DD/YYYY');
            }

            res.send(JSON.stringify(context));
        });
    });
//    }
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

