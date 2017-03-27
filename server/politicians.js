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

router.get('/:id/:catId', function(req, res, next) {
	console.log(req.params.id, req.params.catId)
	Member.findOne({
		where: {ppid: req.params.id}
	})
	.then(member => {
		console.log('this is member', member.firstName)
		return member.getCatScore(req.params.catId, 2000, 2017)
	})
	.then(response => {
		console.log('this is', response)
		res.send(response)
	})
})
module.exports = router;
