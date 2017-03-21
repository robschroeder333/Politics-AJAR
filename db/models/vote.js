'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const Vote = db.define('votes', {
	id: {
    	type: Sequelize.INTEGER,
    	primaryKey: true,
    	autoIncrement: true // Automatically gets converted to SERIAL for postgres
  	},
	position: {
	    type: Sequelize.STRING,
	    allowNull: false,
	    validate: {
	      notEmpty: true
	    }
    // 'position' is the vote "Yes" or "No"
  },
});

module.exports = Vote;