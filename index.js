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

// UPDATE an existing record
app.put('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const { record_name, record_artist, release_date, in_stock } = req.body;

  const sql = `
    UPDATE records
    SET record_name = ?, record_artist = ?, release_date = ?, in_stock = ?
    WHERE id = ?
  `;

  DB.run(sql, [record_name, record_artist, release_date, in_stock, id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).send({ message: "Record not found." });
    }

    res.status(200).send({ message: `Record ${id} updated successfully.` });
  });
});

// GET a single record by id
app.get('/api/records/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM records WHERE id = ?';
  DB.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send({ error: err.message });
    }
    if (!row) {
      return res.status(404).send({ message: "Record not found." });
    }
    res.send({ record: row });
  });
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

//listen to port on Ubuntu EC2 Instance.
app.listen(8443, '0.0.0.0', (err) => {
  console.log('LISTENING on port 8443');
});