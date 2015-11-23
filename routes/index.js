var express = require('express');
var controller = require('./git.controller');
var path    = require("path");
var router = express.Router();

router.get('/', controller.getRepo);
router.get('/git', controller.index);
router.get('/git/fetch', controller.fetch);
router.get('/git/pull/:branch', controller.pull);
router.get('/git/:action/:branch', controller.checkout);

//testing index.html
router.get('/testing', function (req, res) {
	res.sendFile(path.join(__dirname+'/../testing/index.html'));
});
module.exports = router;