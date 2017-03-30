'use strict'

const db = require('../db/_db.js');
const Cats = require('../db/models/cat');

const express = require('express');
const router = new express.Router()

router.get('/', function(req, res, next) {
	Cats.findAll()
	.then(issues => {
		return issues.map(issue => [issue.name, issue.catOrder])
	})
	.then(issueArray =>  {
		res.send(issueArray);
	})
})

module.exports = router;
