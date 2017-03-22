'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const IssueBills = db.define('issue_bills', {
	// id: {
 //    	type: Sequelize.INTEGER,
 //    	primaryKey: true,
 //    	autoIncrement: true // Automatically gets converted to SERIAL for postgres
 //  	}
});

module.exports = IssueBills;
