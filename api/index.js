var express = require('express');
var router = express.Router();


// http://localhost:3000/
router.get('/', function(req, res, next) {
    res.status(200)
        .json({
            status: 'success',
            message: 'initiated the application in localhost:3000'
        });
});


//////////////////////
// Postgres queries
//////////////////////

var db = require('./queries');

// router.get('/api/starships', db.getAllStarships);
router.get('/api/search/:id', db.getUser);
router.post('/api/signup', db.createUser);
router.post('/api/login', db.UserLogin);


module.exports = router;