'use strict';

const db = require('../db/_db.js');
const Member = require('../db/models/member.js')

const express = require('express');
const router = new express.Router()

router.get('/', function(req, res, next) {
  Member.findAll()
  .then(politicians => {
    res.send(politicians)
  })
  .catch(next)
})

module.exports = router;
