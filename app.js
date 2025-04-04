var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// filename - index.js 
const sqlite3 = require('sqlite3');

// Connecting Database
let db = new sqlite3.Database(":memory:" , (err) => {
    if(err)
    {
        console.log("Error Occurred - " + err.message);
    }
    else
    {
        console.log("DataBase Connected");
    }
})

const createTableSql = `
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        record_name TEXT NOT NULL,
        record_artist TEXT UNIQUE NOT NULL,
        release_date TEXT NOT NULL,
        in_stock BOOLEAN
    )`;
    
    app.get("/", (req, res) => {
        db.all("SELECT * FROM records", [], (err, rows) => {
            if (err) {
                return res.status(500).send("Error fetching records");
            }
            // Render the EJS view with the records data
            res.render("read", { records: rows });
        });
    });

// Execute the SQL statement to create the table
db.run(createTableSql, (err) => {
    if (err) {
        return console.error('Error creating table:', err.message);
    }
    console.log('Table created successfully');
});

// Server Running
app.listen(4000 , () => {
    console.log("Server started");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
