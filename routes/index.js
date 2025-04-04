var express = require('express');
var router = express.Router();

const databaseRecords = () =>{
  return [
    { id: 1, name: "Channel Orange", artist: "Frank Ocean", releaseYear: 2012, inStock: false},
    { id: 2, name: "Brand New Eyes", artist: "Paramore", releaseYear: 2009, inStock: true},
    {id: 3, name: "Igor", artist: "Tyler The Creator", releaseYear: 2019, inStock: true},
  ]
}
/* GET home page. */
router.get('/', function(req, res, next) {
  const records = getRecords();//fetch records from database
  res.render('index', { title: "DevOps Projects", records });
});


module.exports = router;
