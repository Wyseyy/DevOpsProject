var express = require('express');
var router = express.Router();

const databaseRecords = () =>{
  return [
    { id: 1, name: "Channel Orange", artist: "Frank Ocean", releaseYear: 2012, InStock: false},
    { id: 2, name: "Brand New Eyes", artist: "Paramore", releaseYear: 2009, InStock: true},
    {id: 3, name: "Igor", artist: "Tyler The Creator", releaseYear: 2019, InStock: true},
  ]
}
/* Home page (brings to read page). */
router.get('/read', function(req, res, next) {
  res.render('read', { title: "View records"});
});

/* Add page. */
router.get('/add', function(req, res, next) {
  res.render('add', { title: "Add a record", records });
});

/* Delete page. */
router.get('/delete', function(req, res, next) {
  const recordId = req.params.id;
  console.log('Deleting record ID: ${recordId}');
});

/* Edit page. */
router.get('/edit', function(req, res, next) {
  const recordId = req.params.id;
  res.render('edit', { title: "Edit records", recordId });
  res.redirect('/');
});


module.exports = router;
