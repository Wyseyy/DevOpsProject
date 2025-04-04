var express = require('express');
var router = express.Router();

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

const databaseRecords = () =>{
  return [
    { id: 1, name: "Channel Orange", artist: "Frank Ocean", releaseYear: 2012, InStock: false},
    { id: 2, name: "Brand New Eyes", artist: "Paramore", releaseYear: 2009, InStock: true},
    {id: 3, name: "Igor", artist: "Tyler The Creator", releaseYear: 2019, InStock: true},
  ]
}

// Server Running
app.listen(4000 , () => {
    console.log("Server started");
})

/* Home page (brings to read page). */
router.get('/read', function(req, res, next) {
  res.render('read', { title: "View records"});
});

/* Add page. */
router.get('views/add', function(req, res, next) {
  res.render('add', { title: "Add a record", records });
});

/* Delete page. */
router.get('views/delete', function(req, res, next) {
  const recordId = req.params.id;
  console.log('Deleting record ID: ${recordId}');
});

/* Edit page. */
router.get('views/edit', function(req, res, next) {
  const recordId = req.params.id;
  res.render('edit', { title: "Edit records", recordId });
  res.redirect('/');
});


module.exports = router;
