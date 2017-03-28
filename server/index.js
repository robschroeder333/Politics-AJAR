'use strict';

const express = require('express');
const router = express.Router();

router.use('/politicians', require('./politicians'))
router.use('/issues', require('./issueCategories')) 

module.exports = router;
