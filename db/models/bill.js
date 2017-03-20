'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const Bill = db.define('bills', {
  number: {
    type: Sequelize.STRING,
    validate: {
      allowNull: false,
      notEmpty: true
    }
  },
  name: {
    type: Sequelize.STRING
  },
  summary: {
    type: Sequelize.STRING
  },
  detail: {
    type: Sequelize.STRING
  },
  committee_name: {
    type: Sequelize.STRING
  },
  vote_outcome: {
    type: Sequelize.STRING
  }
},
{
  getterMethods: {

  }
});

module.exports = Bill;
