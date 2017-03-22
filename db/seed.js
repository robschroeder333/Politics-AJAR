'use strict'; // eslint-disable-line semi

const db = require('./models');
const Issue = db.model('issues');
const Member = db.model('members');
const Vote = db.model('votes');

const seedIssues = () => db.Promise.map([
	{catCode: 'J6100', name: 'Anti-Guns', plusOrMinus: '+'},
	{catCode: 'J6200', name: 'Pro-Guns', plusOrMinus: '-'},
], issue => db.model('issues').create(issue))

const seedBills = () => db.Promise.map([
	{prefix: 'H', number: '101', session: '115', measure: 'H.R. 101 (115<sup>th</sup>)', name: 'Pro-Gun Bill of 2016', year: 2016},
	{prefix: 'H', number: '102', session: '115', measure: 'H.R. 102 (115<sup>th</sup>)', name: 'Another Pro-Gun Bill of 2016', year: 2016},
	{prefix: 'H', number: '103', session: '115', measure: 'H.R. 103 (115<sup>th</sup>)', name: 'A third Pro-Gun Bill of 2016', year: 2015},
	{prefix: 'H', number: '104', session: '115', measure: 'H.R. 104 (115<sup>th</sup>)', name: 'An Anti-Gun Bill of 2016', year: 2016},
	{prefix: 'H', number: '105', session: '115', measure: 'H.R. 105 (115<sup>th</sup>)', name: 'A second Anti-Gun Bill of 2016', year: 2016}
], bill => db.model('bills').create(bill))

const seedMembers = () => db.Promise.map([
	{firstName: 'Rosa', middleName: null, lastName: 'DeLauro', ppid: 'D000216', party: 'D', chamber: 'house', state: 'CT', district: '3', electionYear: '2018'},
	{firstName: 'Lloyd', middleName: null, lastName: 'Doggett', ppid: 'D000399', party: 'D', chamber: 'house', state: 'TX', district: '35', electionYear: '2018'}
], member => db.model('members').create(member))

const seedMembersInfo = () => db.Promise.map([
	{twitter: 'RosaDeLauro', facebook: 'CongresswomanRosaDeLauro', website: 'https://delauro.house.gov', phone: '202-225-3661', office: '', memberId: 1},
	{twitter: 'RepLloydDoggett', facebook: 'lloyddoggett', website: 'https://doggett.house.gov', phone: '202-225-4865', office: '', memberId: 2}
], memberInfo => db.model('member_info').create(memberInfo))

db.sync({force: true})
  .then(seedIssues)
  .then(issues => console.log(`Seeded ${issues.length} issues OK`))
  .then(seedBills)
  .then(bills => console.log(`Seeded ${bills.length} bills OK`))
  .then(seedMembers)
  .then(members => console.log(`Seeded ${members.length} members OK`))
  .then(seedMembersInfo)
  .then(memberInfo => console.log(`Seeded ${memberInfo.length} memberInfo OK`))
  .then(() => Issue.findById(1))
  .then((issue) => issue.addIssue_bills([4, 5]))
  .then(() => Issue.findById(2))
  .then((issue) => issue.addIssue_bills([1, 2, 3]))
  .then(() => Member.findById(1))
  .then((member) => member.addBill_vote(1, {position: 'yes'}))
  .then(() => Member.findById(1))
  .then((member) => member.addBill_vote(2, {position: 'no'}))
  .then(() => Member.findById(1))
  .then((member) => member.addBill_vote(3, {position: 'yes'}))
  .then(() => Member.findById(1))
  .then((member) => member.addBill_vote(4, {position: 'yes'}))
  .then(() => Member.findById(1))
  .then((member) => member.addBill_vote(5, {position: 'no'}))
  .then(() => Member.findById(2))
  .then((member) => member.addBill_vote(1, {position: 'no'}))
  .then(() => Member.findById(2))
  .then((member) => member.addBill_vote(2, {position: 'no'}))
  .then(() => Member.findById(2))
  .then((member) => member.addBill_vote(3, {position: 'no'}))
  .then(() => Member.findById(2))
  .then((member) => member.addBill_vote(4, {position: 'no'}))
  .then(() => Member.findById(2))
  .then((member) => member.addBill_vote(5, {position: 'no'}))

  // .then(() => Issue.findById(1))
  // .then((issue) => issue.getIssue_bills())
  // .then(billArr => {billArr.forEach(bill => console.log(bill.id));})

  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(1))
  .then(score => console.log('Lloyd pro-gun score is: ', score))
  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(2))
  .then(score => console.log('Lloyd anti-gun score is: ', score))
  .then(() => Member.findById(2))
  .then(member => member.getIssueScore(1))
  .then(score => console.log('Rosa pro-gun score is: ', score))
  .then(() => Member.findById(2))
  .then(member => member.getIssueScore(2))
  .then(score => console.log('Rosa anti-gun score is: ', score))
  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(1, 2012, 2015))
  .then(score => console.log('Lloyd pre-2016 pro-gun score is: ', score))
  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(2, 2012, 2015))
  .then(score => console.log('Lloyd pre-2016 anti-gun score is: ', score))
  // .then(() => Vote.findById(1))
  // .then((vote) => vote.addScore(1, {score: 1}))
  .catch(error => console.error(error))
  .finally(() => db.close());
