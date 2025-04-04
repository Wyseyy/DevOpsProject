var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3');

// Connecting Database
let db = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.log("Error Occurred - " + err.message);
    } else {
        console.log("Database Connected");
    }
});

// Create Table
const createTableSql = `
    CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        record_name TEXT NOT NULL,
        record_artist TEXT UNIQUE NOT NULL,
        release_date TEXT NOT NULL,
        in_stock BOOLEAN
    )`;

db.run(createTableSql, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table created successfully');
    }
});

// Dummy Data
const databaseRecords = () => {
    return [
        { id: 1, name: "Channel Orange", artist: "Frank Ocean", releaseYear: 2012, InStock: false },
        { id: 2, name: "Brand New Eyes", artist: "Paramore", releaseYear: 2009, InStock: true },
        { id: 3, name: "Igor", artist: "Tyler The Creator", releaseYear: 2019, InStock: true },
    ];
};

// Home Route (Redirect to Read Page)
router.get("/", (req, res) => {
    db.all("SELECT * FROM records", [], (err, rows) => {
        if (err) {
            return res.status(500).send("Error fetching records");
        }
        res.render("read", { records: rows });
    });
});

// Read Page
router.get("/read", function(req, res) {
    res.render("read", { title: "View Records", records: databaseRecords() });
});

// Add Record Page
router.get("/add", function(req, res) {
    res.render("add", { title: "Add a Record" });
});

// Delete Record Page
router.post("/delete/:id", function(req, res) {
    const recordId = req.params.id;
    db.run("DELETE FROM records WHERE id = ?", [recordId], function(err) {
        if (err) {
            return res.status(500).send("Error deleting record");
        }
        res.redirect("/read");
    });
});

// Edit Record Page
router.get("/edit/:id", function(req, res) {
    const recordId = req.params.id;
    db.get("SELECT * FROM records WHERE id = ?", [recordId], (err, record) => {
        if (err) {
            return res.status(500).send("Error fetching record");
        }
        if (!record) {
            return res.status(404).send("Record not found");
        }
        res.render("edit", { title: "Edit Record", record });
    });
});

// Update Record Route
router.post("/update/:id", function(req, res) {
    const recordId = req.params.id;
    const { name, artist, releaseYear, InStock } = req.body;

    db.run(
        "UPDATE records SET record_name = ?, record_artist = ?, release_date = ?, in_stock = ? WHERE id = ?",
        [name, artist, releaseYear, InStock, recordId],
        function(err) {
            if (err) {
                return res.status(500).send("Error updating record");
            }
            res.redirect("/read");
        }
    );
});

module.exports = router;
