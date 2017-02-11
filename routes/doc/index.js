var express = require('express');
var router = express.Router();

/* GET doc page. */
router.get('/', function(req, res, next) {
    
    res.render('doc/index');
});

module.exports = router;
