var express = require('express');
var router = express.Router();
const api = require ('../controllers/api.controller')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/shorten', api.shorten)
router.get('/:shortcode', api.getShortCode)

module.exports = router;
