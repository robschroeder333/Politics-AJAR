'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');

const Member = db.define('members', {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  middleName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  ppid: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  party: {
    type: Sequelize.ENUM('D', 'R', 'I')
  },
  chamber: {
    type: Sequelize.ENUM('senate', 'house')
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  district: {
    type: Sequelize.STRING
  },
  electionYear: {
    type: Sequelize.STRING
  }
},
{
  getterMethods: {
    fullName() {
      return (this.middleName)
        ? `${this.firstName} ${this.middleName} ${this.lastName}`
        : `${this.firstName} ${this.lastName}`;
    },
    chamberName() {
      return (this.chamber === 'senate')
        ? 'Senate'
        : 'House of Representatives';
    }
  },
  hooks: {
    beforeCreate: function(member) {
      if (member.chamber === 'senate'){
        member.district = null;
      }
    }}
});

module.exports = Member;
