'use strict';

const Sequelize = require('sequelize');

const url = 'postgres://localhost:5432/politicsAJAR';
const db = new Sequelize(url, {
	logging: false
});

module.exports = { db }


//process.env.DATABASE_URL || 
