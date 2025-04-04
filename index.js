//connects to connect.js containing records table from mydata.db
import { DB } from './connect.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Required for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html at root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Record store service is online');
});

// GET all records
app.get('/api/records', (req, res) => {
  res.set('content-type', 'application/json');
  const sql = 'SELECT * FROM records';
  let data = { records: [] };
  try {
    DB.all(sql, [], (err, rows) => {
      if (err) throw err;
      rows.forEach((row) => {
        data.records.push(row);
      });
      res.send(JSON.stringify(data));
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ code: 500, status: err.message });
  }
});

// POST a new record
app.post('/api/records', (req, res) => {
  const { record_name, record_artist, release_date, in_stock } = req.body;
  const sql = `INSERT INTO records (record_name, record_artist, release_date, in_stock) VALUES (?, ?, ?, ?)`;

  try {
    DB.run(sql, [record_name, record_artist, release_date, in_stock], function (err) {
      if (err) throw err;
      res.status(201).send({
        status: 201,
        message: `Record ${this.lastID} saved.`,
      });
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ code: 500, status: err.message });
  }
});

// DELETE a record
app.delete('/api/records', (req, res) => {
  const sql = 'DELETE FROM records WHERE id=?';
  try {
    DB.run(sql, [req.query.id], function (err) {
      if (err) throw err;
      if (this.changes === 1) {
        res.status(200).send({ message: `Record ${req.query.id} was removed.` });
      } else {
        res.status(200).send({ message: 'No record deleted.' });
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ code: 500, status: err.message });
  }
});

//lsitent to port on EC2 Instance
app.listen(8443, '0.0.0.0', (err) => {
  console.log('LISTENING on port 8443');
});

// var express = require('express');
// var router = express.Router();

// const databaseRecords = () =>{
//   return [
//     { id: 1, name: "Channel Orange", artist: "Frank Ocean", releaseYear: 2012, inStock: false},
//     { id: 2, name: "Brand New Eyes", artist: "Paramore", releaseYear: 2009, inStock: true},
//     {id: 3, name: "Igor", artist: "Tyler The Creator", releaseYear: 2019, inStock: true},
//   ]
// }
// /* Home page (brings to read page). */
// router.get('/', function(req, res, next) {
//   const records = records();//fetch records from database
//   res.render('index', { title: "DevOps Projects", records });
// });

// /* Add page. */
// router.get('views/add', function(req, res, next) {
//   res.render('add', { title: "Add a record", records });
// });

// /* Delete page. */
// router.get('views/delete', function(req, res, next) {
//   const recordId = req.params.id;
//   console.log('Deleting record ID: ${recordId}');
// });

// /* Edit page. */
// router.get('views/edit', function(req, res, next) {
//   const recordId = req.params.id;
//   res.render('edit', { title: "Edit records", recordId });
// });


// module.exports = router;
