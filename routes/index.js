var express = require('express');
var router = express.Router();

const databaseRecords = () =>{
  return [
    { id: 1, name: "Channel Orange", artist: "Frank Ocean", releaseYear: 2012, inStock: false},
    { id: 2, name: "Brand New Eyes", artist: "Paramore", releaseYear: 2009, inStock: true},
    {id: 3, name: "Igor", artist: "Tyler The Creator", releaseYear: 2019, inStock: true},
  ]
}
/* Home page (brings to read page). */
router.get('/', function(req, res, next) {
  const records = records();//fetch records from database
  res.render('function', { title: "DevOps Projects", records });
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
});


module.exports = router;