//Taylor Liss - Oregon State University - Prof. Luyao Zhang - CS290 Web Dev 
//Winter 2017 - Week 9 Database Interactions and UI

//*****Express stuff*********
var express = require('express');
var app = express();
app.use(express.static('public'));

//*****BodyParser stuff*******
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
var mysql = require('./dbcon.js');

app.set('port', 3645);

//*****Routes*************

//This is the route called when the homepage is first visited, and when the
//back button is pressed on the update page.
app.get('/',function(req,res,next){
    var context = {};
    var subScript = "<script id=\"onStart\">window.addEventListener('load', function(){displayTable();});</script>";
    context.test = subScript;
    
    res.render('home', context);
});

//This route grabs the table data and uses handlebars to update the table in
//the home page.
app.post('/getTable',function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
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

//This route is called by the delete button on the home page. It removes
//a row using data passed to it by the delete button.
app.post('/remove', function(req,res,next){
    
    mysql.pool.query("DELETE FROM workouts WHERE id=" + req.body.rowId, function(err, rows, fields){
        if (err){
            next(err);
            return;
        }
        res.send(null);
    });
});

//This route gets called from the edit button on the home page. It takes 
//the values from the home page and passes them onto the update page.
app.post('/edit',function(req,res,next){
    var data = JSON.parse(req.body.package);
    
    var date = data.date;
    date = moment(date).format('YYYY-MM-DD');
    data.date = date;
    
    var lbs = data.lbs;
    if (lbs === "Yes") {
        data.lbs = true;
    } else {
        data.lbs = false;
    }
    
    res.render('update', data);
});

//This route is called when a submission is made form the update page. It
//takes values passed to it by the submit button, and updates the values
//in the database accordingly.
app.post('/update',function(req,res,next){
    var data = req.body;

    var createString ="UPDATE workouts SET" +
            " name='" + data.name + 
            "', reps=" + data.reps + 
            ", weight=" + data.weight + 
            ", date='" + data.date + 
            "', lbs=" + data.lbs + 
            " WHERE id=" + data.id;

    mysql.pool.query(createString, function(err, rows, fields){
        if (err){
            next(err);
            return;
        }
        res.send(null);
    });
});

//This route is called by the submit button on the home page. It takes the values
//passed to it and adds them to the database.
app.post('/insert',function(req,res,next){
    var context = {};
    var data = req.body;

    mysql.pool.query("INSERT INTO workouts SET ?", data, function(err, rows, fields){
        if (err){
            next(err);
            return;
        }
        mysql.pool.query("SELECT * FROM workouts", function(err, rows, fields){
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

//This route is for resetting/setting-up the database table.
app.get('/reset-table',function(req,res,next){
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT, "+
    "name VARCHAR(255) NOT NULL, "+
    "reps INT, "+
    "weight INT, "+
    "date DATETIME, "+
    "lbs BOOLEAN);";
    mysql.pool.query(createString, function(err){
        var context = {};
        var subScript = "<script id=\"onStart\">window.addEventListener('load', function(){window.location.href = './';});</script>";
        context.test = subScript;
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

