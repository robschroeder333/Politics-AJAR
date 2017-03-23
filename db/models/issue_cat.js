'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const IssueCat = db.define('issue_cats', {
  plusOrMinus: {
    type: Sequelize.ENUM('+', '-'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
},
{
  getterMethods: {

  }
});

module.exports = IssueCat;
