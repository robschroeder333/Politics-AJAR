'use strict';
// eslint-disable-line semi
/* eslint-disable camelcase */

const Sequelize = require('sequelize');
const db = require('../_db.js');
const Issue = require('./issue.js');
const Bill = require('./bill.js');
const IssueBill = require('./issue_bill.js');
const Vote = require('./vote.js');
const Cat = require('./cat.js');

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
    unique: true,
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
  instanceMethods: {
    getIssueScore (issueId, startYear, endYear) {
      //called on member instance, issue id required.
      //startYear and endYear will be optional,
      //and limit score calculation to bills between specified years
      //year functionality temporarily removed
      if (startYear === undefined) { startYear = 2000; }
      if (endYear === undefined) { endYear = 2017; }
      const mId = this.id;
      const forOrAgaisntArr = {};
      return IssueBill.findAll({
        where: {
          issueId: issueId
        }
        // ,
        // include: [{
        //     model: Bill,
        //     where: {
        //       year: {
        //         $between: [startYear, endYear]
        //       }
        //   }
        // }
        // ]
      })
      .then(issueBills => {
          const issueBillArr = [];
          issueBills.forEach(issueBill => {
            if (issueBill !== null) {
            issueBillArr.push(issueBill.billId);
            forOrAgaisntArr[issueBill.billId] = issueBill.forOrAgainst;}

          });
          return issueBillArr;
        })
      .then(bIds => {
        const voteArr = [];
        bIds.forEach(bId => voteArr.push(Vote.findOne({
                  where: {
                    billId: bId,
                    memberId: mId
                  }
                })
              ));
        return voteArr;
      })
      .then(vs => Promise.all(vs))
      .then(votes => {
        let voteScore = 0;
        if (votes.length !== 0){
          votes.forEach(vote => {
            {
              if (forOrAgaisntArr[vote.billId] === 'for'){
                if (vote.position === 'yes') {voteScore++;}
                else {
                  voteScore--;
                }
              }
              else if (forOrAgaisntArr[vote.billId] === 'against'){
                if (vote.position === 'no') {voteScore++;}
                else {
                  voteScore--;
                }
              }
            }
          });
        }
        return (votes.length !== 0) ? [voteScore, votes.length] : [0, 0];
        // ((score / votes.length) * 100)
      })
      .catch(error => console.error(error));
    },
    getMemberCatScore (catId, startYear, endYear) {
      //called on member instance, category id required.
      //startYear and endYear are optional,
      //and limit score calculation to bills between specified years
      //year functionality removed for now
      //catId can either be the cats id or catOrder
      const member = this;
      const findCat = function (input){
        if (typeof input === 'string'){
          return Cat.findOne({where: {catOrder: input}});
        }
        else {
          Cat.findById(input);
        }
      };

      return findCat(catId)
      .then(cat => cat.getIssue_cats())
      .then(issues => {
        let arr = [];
        issues.forEach(issue => {
          arr.push(issue.getIssue_cats());
        });
        return Promise.all(arr);
      })
      .then(result => {
        // console.log('issueId is ', result[0][0]['issue_cats']['dataValues']['issueId'], ' plusOrMinus is ', result[0][0]['issue_cats']['dataValues']['plusOrMinus']);
        // console.log('issueId is ', result[1][0]['issue_cats']['dataValues']['issueId'], ' plusOrMinus is ', result[1][0]['issue_cats']['dataValues']['plusOrMinus']);
        let scoreArr = [];
        result.forEach(issue => {
          let inArr = [];
          inArr.push(issue[0].issue_cats.dataValues.plusOrMinus);
          inArr.push(member.getIssueScore(issue[0].issue_cats.dataValues.issueId, startYear, endYear));
          // console.log(`${member.dataValues.lastName} has a score of ${inArr[1]}`);
          scoreArr.push(Promise.all(inArr));
        });
        return Promise.all(scoreArr);
      })
      .then(scores => {
        // console.log('all the different scores are', scores)
        let score = 0;
        let voteCount = 0;
        let memberScore = 0;
        scores = scores[0];
        for (let i = 0; i < scores.length; i++){
          // if (scores[i][1][0][0] === '-'){
          //   score += (scores[i][1][1] - scores[i][1][0]);
          //   voteCount += scores[i][1][1];
          // }
          // else {
          //   score += scores[i][1][0];
          //   voteCount += scores[i][1][1];
          // }
        }
        // memberScore = (score / voteCount) * 100;
        // console.log('scores 1 is', scores[1])

        if (scores[1] && scores[1][1] !== 0){
          memberScore = (scores[1][0] / scores[1][1]) * 100;
          // console.log('calculated', memberScore)
            // memberScore = 50;
        } else {
          memberScore = 0;
        }

        return memberScore;
        // return [Math.floor(memberScore - 0), Math.floor(Math.abs(memberScore - 25)), Math.floor(Math.abs(memberScore - 50)), Math.floor(Math.abs(memberScore - 75)), Math.floor(100 - memberScore)];

      })
      .catch(error => console.error(error));
    },
    getCatScore(catId, startYear, endYear) {
      return this.getMemberCatScore(catId, startYear, endYear)
       .then(memberScore => {
         
         // if (memberScore === undefined){
         //   memberScore = 50;
         // }
         // console.log('member score is - ',memberScore)
         // return [Math.floor(memberScore - 0), Math.floor(Math.abs(memberScore - 25)), Math.floor(Math.abs(memberScore - 50)), Math.floor(Math.abs(memberScore - 75)), Math.floor(100 - memberScore)];
         // console.log([(1 - Math.abs((memberScore -(-100))/200)) * 100, (1 - Math.abs((memberScore - (-50))/200)) * 100, (1 - Math.abs((memberScore - 0)/200)) * 100, (1 - Math.abs((memberScore - 50)/200)) * 100, (1 - Math.abs((memberScore - 100)/200)) * 100])

         return [(1 - Math.abs((memberScore -(-100))/200)) * 100, (1 - Math.abs((memberScore - (-50))/200)) * 100, (1 - Math.abs((memberScore - 0)/200)) * 100, (1 - Math.abs((memberScore - 50)/200)) * 100, (1 - Math.abs((memberScore - 100)/200)) * 100];
       })
       .catch(err => console('hi'));
       // console.log('this is the memberScore: ', memberScore);

    }
  },
  getterMethods: {
    fullName() {
      return (this.middleName)
        ? `${this.firstName} ${this.middleName} ${this.lastName}`
        : `${this.firstName} ${this.lastName}`;
    },
    chamberName() {
      return (this.chamber === 'senate')
        ? 'Senate'
        : 'House of Reps.';
    },
    partyName() {
      if (this.party === 'D') return 'Democrat'
      if (this.party === 'R') return 'Republican'
      if (this.party === 'I') return 'Independent'
      else return 'No party listed'
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
