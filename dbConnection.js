import sqlite3 from 'sqlite3';
const sql3 = sqlite3.verbose();
//Create a new sql3 db with mydata.db to save input data
const DB = new sql3.Database('./mydata.db', sqlite3.OPEN_READWRITE, connected);

//connect to db else throw error
function connected(err) {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('Created the DB/ SQLite DB does already exist');
}
//create records table
let sql = `CREATE TABLE IF NOT EXISTS records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        record_name TEXT NOT NULL,
        record_artist TEXT UNIQUE NOT NULL,
        release_date TEXT NOT NULL,
        in_stock BOOLEAN
    )`;

DB.run(sql, [], (err) => {
  //callback function
  if (err) {
    console.log('error creating enemies table');
    return;
  }
  console.log('CREATED TABLE');
});

export { DB };