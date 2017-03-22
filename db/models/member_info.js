'use strict';

const Sequelize = require('sequelize');
const db = require('../_db.js')

const MemberInfo = db.define('member_info', {
  twitter: {
    type: Sequelize.STRING
  },
  facebook: {
    type: Sequelize.STRING
  },
  website: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  office: {
    type: Sequelize.STRING
  }
})

module.exports = MemberInfo;
