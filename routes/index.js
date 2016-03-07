var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var app = require('../app');

connection = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  password: "root",
  database: "schools",
  debug: false
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});


/* GET home page. */ 
router.get('/', function(req, res) {
  res.render('index', { title: 'Schools Database' });
});



//  /schools

router.get('/v1/schools', function(req, res) {
  /*
  *  Sanitize data, make sure they are integers
  */
  req.sanitize('offset').toInt();
  req.sanitize('count').toInt();
  req.sanitize('district_id').toInt();
  req.sanitize('zip').toInt();
  req.sanitize('name').toString();
  req.sanitize('city').toString();

  var offset = req.query.offset || 0 ;
  var count  = req.query.count  || 10;

  var district = function findDistrict(){
    if (req.query.district_id) {
      return ' AND district_id=' + connection.escape(req.query.district_id);
    }
    return '';
  }

  var zip = function findZip(){
    if (req.query.zip) {
      return ' AND zip=' + connection.escape(req.query.zip);
    }
    return '';
  }

  var name = function findName(){
    if (req.query.name) {
      return ' AND name LIKE "%' + req.query.name + '%"';
    }
    return '';
  }

  var city = function findCity(){
    if (req.query.city) {
      return ' AND city LIKE "%' + req.query.city + '%"';
    }
    return '';
  }

  res.setHeader("Content-Type", "application/json");
  connection.query('SELECT * FROM schools WHERE 1=1 '+ district() + name() + city() + zip() +' LIMIT ?, ?', [ offset, count ], function(err, rows, fields) {
    res.end(JSON.stringify(rows));
  });

});


// /schools/:id

router.get('/v1/schools/:id', function(req, res) {

  req.sanitize('id').toInt();

  res.setHeader("Content-Type", "application/json");
  connection.query('SELECT * FROM schools WHERE id = ?', [req.params.id] , function(err, rows, fields) {
   res.end(JSON.stringify(rows));
  });
});


//  /districts

router.get('/v1/districts', function(req, res) {
  /*
  *  Sanitize data, make sure they are integers
  */
  req.sanitize('offset').toInt();
  req.sanitize('count').toInt();
  req.sanitize('zip').toInt();
  req.sanitize('name').toString();

  var offset = req.query.offset || 0 ;
  var count  = req.query.count  || 10;

  var name = function findName(){
    if (req.query.name) {
      return ' AND name LIKE "%' + req.query.name + '%"';
    }
    return '';
  }

  var zip = function findZip(){
    if (req.query.zip) {
      return ' AND zip=' + connection.escape(req.query.zip);
    }
    return '';
  }

  res.setHeader("Content-Type", "application/json");
  connection.query('SELECT * FROM districts WHERE 1=1 '+ name() + zip() +' LIMIT ?, ?', [ offset, count ], function(err, rows, fields) {
    res.end(JSON.stringify(rows));
  });
});


// /district/:id

router.get('/v1/districts/:id', function(req, res) {
  req.sanitize('id').toInt();

  res.setHeader("Content-Type", "application/json");
  connection.query('SELECT * FROM districts WHERE id = ?', [req.params.id], function(err, rows, fields) {
    res.end(JSON.stringify(rows));
  });
});

// /heartbeat
router.get('/heartbeat', function(req, res) {
  connection.query('SELECT 1 FROM districts LIMIT 1', function(err, rows, fields) {
    res.end(JSON.stringify(rows));
  });
});

module.exports = router;
