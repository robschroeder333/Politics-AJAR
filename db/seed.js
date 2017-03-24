'use strict'; // eslint-disable-line semi

const db = require('./models');
const Issue = db.model('issues');
const Member = db.model('members');
const Vote = db.model('votes');
const Bill = db.model('bills');
const Cat = db.model('cats');

const seedIssues = () => db.Promise.map([
	{catCode: 'J6100', name: 'Anti-Guns'},
	{catCode: 'J6200', name: 'Pro-Guns'}
], issue => db.model('issues').create(issue));

const seedCats = () => db.Promise.map([
  {name: 'Gun Control'}
], cat => db.model('cats').create(cat));

const seedBills = () => db.Promise.map([
	{prefix: 'H', number: '101', session: '115', name: 'Pro-Gun Bill of 2016', year: 2016},
	{prefix: 'H', number: '102', session: '115', name: 'Another Pro-Gun Bill of 2016', year: 2016},
	{prefix: 'H', number: '103', session: '115', name: 'A third Pro-Gun Bill of 2016', year: 2016},
	{prefix: 'H', number: '104', session: '115', name: 'An Anti-Gun Bill of 2016', year: 2015},
	{prefix: 'H', number: '105', session: '115', name: 'A second Anti-Gun Bill of 2016', year: 2016},
  {prefix: 'H', number: '105', session: '115', name: 'A duplicate bill', year: 2016},
  {prefix: 'H', number: '105', session: '115', name: 'Another duplicate bill', year: 2016},
  {prefix: 'H', number: '106', session: '115', name: 'Another Pro-Gun bill also 2016', year: 2016},
], bill => db.model('bills').create(bill).catch(() => console.error('You made a duplicate request')))

// const updateBill = () => db.Promise.map([
//   {prefix: 'H', number: '105', session: '115', name: 'A duplicate bill', year: 2016}
// ], bill => db.model('bills').update(bill))

const seedMembers = () => db.Promise.map([
	{firstName: 'Rosa', middleName: null, lastName: 'DeLauro', ppid: 'D000216', party: 'D', chamber: 'house', state: 'CT', district: '3', electionYear: '2018'},
	{firstName: 'Lloyd', middleName: null, lastName: 'Doggett', ppid: 'D000399', party: 'D', chamber: 'house', state: 'TX', district: '35', electionYear: '2018'},
  {firstName: 'Darth', middleName: null, lastName: 'Vader-Mitchell', ppid: 'Z666999', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
  {firstName: 'Luke', middleName: null, lastName: 'SkyWalker', ppid: 'Z666999', party: 'D', chamber: 'senate', state: 'MI', district: '89', electionYear: '2020'},
  {firstName: 'Naruto', middleName: null, lastName: 'Johnuzaki', ppid: 'A123456', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
  {firstName: 'Eric', middleName: null, lastName: 'Fromm', ppid: 'A183921', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
  {firstName: 'Van', middleName: null, lastName: 'Helsing', ppid: 'B183819', party: 'D', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
  {firstName: 'Sasuke', middleName: null, lastName: 'Brother', ppid: 'C183839', party: 'D', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
  {firstName: 'Bro', middleName: null, lastName: 'Mo-Sapiens', ppid: 'D183912', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
], member => db.model('members').create(member).catch(() => console.error('You made a duplicate request')))

const seedWrongMembers = () => db.Promise.map([
  {firstName: 'Ted', middleName: null, lastName: 'Danson', ppid: 'D000217', party: 'I', chamber: 'house', state: 'CO', district: '4', electionYear: '2018'},
  {firstName: 'Jake', middleName: 'Fred', lastName: 'Nike', ppid: 'D000399', party: 'R', chamber: 'house', state: 'TN', district: '32', electionYear: '2018'}
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
  .then(seedCats)
  .then(cat => console.log(`Seeded ${cat.length} catagories OK`))
  .then(() => Cat.findById(1))
  // .then((cat) => console.log(cat))
  .then((cat) => {cat.addIssue_cat(1, {plusOrMinus: '+'})
  return cat})
  .then((cat) => cat.addIssue_cat(2, {plusOrMinus: '-'}))
  // .then(() => Cat.findById(2))
  // .then((cat) => cat.addIssue_cats([1]))
  .then(() => Issue.findById(1))
  .then((issue) => issue.addIssue_bills([4, 5]))
  .then(() => Issue.findById(2))
  .then((issue) => issue.addIssue_bills([1, 2, 3, 8]))
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
  .then(() => Member.findById(1))
  .then((member) => member.addBill_vote(8, {position: 'yes'}))
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
  .then(() => Member.findById(2))
  .then((member) => member.addBill_vote(8, {position: 'yes'}))
  // .then(() => Issue.findById(1))
  // .then((issue) => issue.getIssue_bills())
  // .then(billArr => {billArr.forEach(bill => console.log(bill.id));})

  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(1))
  .then(score => console.log('Lloyd anti-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(2))
  .then(score => console.log('Lloyd pro-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  .then(() => Member.findById(2))
  .then(member => member.getIssueScore(1))
  .then(score => console.log('Rosa anti-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  .then(() => Member.findById(2))
  .then(member => member.getIssueScore(2))
  .then(score => console.log('Rosa pro-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(1, 2012, 2015))
  .then(score => console.log('Lloyd pre-2016 anti-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  .then(() => Member.findById(1))
  .then(member => member.getIssueScore(2, 2012, 2015))
  .then(score => console.log('Lloyd pre-2016 pro-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))

  .then(() => Member.findById(1))
  .then(member => member.getCatScore(1, 2012, 2016))
  .then(score => console.log("Lloyd's array of scores for alignment to possible user positions on Gun Control are:\n", score, '\nIn order, these alignments are if the user\n [strongly disagrees, disagrees, is neutral, agrees, strongly agrees] with the issue.'))
  .then(() => Member.findById(2))
  .then(member => member.getCatScore(1, 2012, 2016))
  .then(score => console.log("Rosa's array of scores for alignment to possible user positions on Gun Control are:\n", score, '\nIn order, these alignments are if the user\n [strongly disagrees, disagrees, is neutral, agrees, strongly agrees] with the issue.'))
 

  .then(() => Bill.findById(5))
  .then(bill => bill.update({name: 'A new name!'}))

  // .then(seedWrongMembers)
  // .then(members => console.log(`Seeded ${members.length} members OK`))

  .catch(error => console.error(error))
  .finally(() => db.close());
