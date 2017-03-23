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
    unique: true
    // type: Sequelize.VIRTUAL,
    // get: function() { return this.prefix + this.number + this.session },
    // attributes: ['prefix', 'number', 'session'],
    // include: [ { attributes: ['prefix', 'number', 'session'] } ],
    // 'measure' includes prefix, number and session of congress. ex: H 319 115
    // this is set through beforeCreate hook. This is used to prevent duplicate records being created
  },
  name: {
    type: Sequelize.STRING
    // 'name' is the common English title. Comes in through the 'topic' key. ex: 'Seniors Have Eyes, Ears, and Teeth Act of 2017'
  },
  year: {
    type: Sequelize.INTEGER
    // 'year' is the year the bill was voted on
  }
},
{
  getterMethods: {

  },
  hooks: {
    beforeCreate: checkForUniqueMeasure,
    beforeUpdate: checkForUniqueMeasure,
    beforeBulkCreate: bulkCheckForUniqueMeasure,
    beforeBulkUpdate: bulkCheckForUniqueMeasure
  }
});

function checkForUniqueMeasure(bill){

  bill.measure = bill.prefix + bill.number + ' ' + bill.session;
  // const bill = this;
  // console.log(bill.measure)
  // console.log(bill.prefix, bill.number, bill.session);
  // Bill.find({attributes: ['measure']})
  // .then(thing => {console.log(thing.measure)
  //   return thing})
  // .then(foundBill => {
  //   if (foundBill.measure === bill.prefix + bill.number + bill.session) {
  //     console.log('I found a duplicate!')
  //   }
  // })
  // .then(dupBill => {
  //   // console.log(dupBill.id)
  //   if (dupBill.id) {
  //   //bill.validate({isNull: true})
  //     console.log(dupBill.id)
  //     console.log('I found a duplicate!')
  //   }
  //     //throw new Error('this bill already exists')}
  // })
  // .catch(err => console.error(err))
}

function bulkCheckForUniqueMeasure(bills){
  bills.map((bill) => {
    bill.measure = bill.prefix + bill.number + ' ' + bill.session;
    return bill}
  );
}

module.exports = Bill;

//make an index as composite in order for unique: true effect on multiple keys
// custom .catch that checks the error type. Throw if different error, tell to ignore if expected error
