'use strict';

const express = require('express');
const router = express.Router();

router.use('/politicians', require('./politicians'))

module.exports = router;
