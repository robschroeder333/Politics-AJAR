'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');
// const Bill = require('./bill.js');
// const Vote = require('./vote.js');

const Score = db.define('scores', {
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: -1,
      max: 1,
      isNotZero: function(value){
        if (value === 0) {
          throw new Error('Only non-zero values are allowed!');
        }
      }
    }
    // 'score' is +1 or -1 for a vote on a particular issue.
  },
  // issue: {
  //   type: Sequelize.VIRTUAL,
  //   get: function() {
  //     return Vote.findById(this.voteId)
  //     .then(vote => {
  //       return Bill.findById(vote.billId)
  //     })
  //     .then(bill => {
  //       return bill.getIssues()
  //     })
  //     .then(issues => {
  //       return issues[0];
  //     })
  //     .catch(err => console.error(err));



      // Bill.findById(this.voteId)
      //this.voteId
      //vote.getBill()
      //bill.getIssues()
    // }
  // }
},
{
  getterMethods: {
      //note: define total votes as a getter method
  }
});

module.exports = Score;
