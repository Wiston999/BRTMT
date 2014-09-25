'use strict';

var express = require('express');
var controller = require('./basicInfo.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:mode', controller.show);

module.exports = router;