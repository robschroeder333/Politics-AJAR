'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const IssueBills = db.define('issue_bills', {
	forOrAgainst: {
    	type: Sequelize.ENUM('for', 'against'),
  	}
});

module.exports = IssueBills;
