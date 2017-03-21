'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Vote = require('./vote.js');
const Issue = require('./issue.js');
const Score = require('./score.js');

const MemberIssue = db.define('member_issues', {
  totalScore: {
    type: Sequelize.INTEGER
    // 'totalScore' aggregates score from score table by member and issue
  }
},
{
  hooks: {
    beforeCreate: setTotalScore,
    beforeUpdate: setTotalScore
  }
});

function setTotalScore(memberIssue){
  const mId = memberIssue.memberId;
  const iId = memberIssue.issueId;

  return Issue.findById(iId)
  .then(issue => {
    return issue.getBills();
  })
  .then(bills => {
    const billIds = bills.map(bill => bill.id);
    return billIds.map(bId => Vote.findOne({where: {billId: bId, memberId: mId}}));
  })
  .then(votes => {
    return votes.map(vote => Score.findOne({where: {voteId: vote.id, issueId: iId}}))
  })
  .catch(err => console.error(err));
}

module.exports = MemberIssue;
