'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const Bill = db.define('bills', {
  prefix: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
    // 'prefix' to the bill code, indicating house or senate. ex: 'H'
  number: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
    // 'number' is the bill number. ex: '508'
  session: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
    // 'session' is the session of congress. ex: '115'
  measure: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
    // 'measure' includes prefix, number and session of congress. ex: H.R. 319, 115th (session)
  },
  name: {
    type: Sequelize.STRING
    // 'name' is the common English title. Comes in through the 'topic' key. ex: 'Seniors Have Eyes, Ears, and Teeth Act of 2017'
  }
},
{
  getterMethods: {

  }
});

module.exports = Bill;
