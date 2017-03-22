'use strict'; // eslint-disable-line semi

const db = require('./models');
const Issue = db.model('issues');

const seedIssues = () => db.Promise.map([
	{catCode: 'J6100', name: 'Anti-Guns'},
	{catCode: 'J6200', name: 'Pro-Guns'},
], issue => db.model('issues').create(issue))

const seedBills = () => db.Promise.map([
	{prefix: 'H', number: '101', session: '115', measure: 'H.R. 101 (115<sup>th</sup>)', name: 'Pro-Gun Bill of 2016'},
	{prefix: 'H', number: '102', session: '115', measure: 'H.R. 102 (115<sup>th</sup>)', name: 'Another Pro-Gun Bill of 2016'},
	{prefix: 'H', number: '103', session: '115', measure: 'H.R. 103 (115<sup>th</sup>)', name: 'A third Pro-Gun Bill of 2016'},
	{prefix: 'H', number: '104', session: '115', measure: 'H.R. 104 (115<sup>th</sup>)', name: 'An Anti-Gun Bill of 2016'},
	{prefix: 'H', number: '105', session: '115', measure: 'H.R. 105 (115<sup>th</sup>)', name: 'A second Anti-Gun Bill of 2016'}
], bill => db.model('bills').create(bill))

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

], member => db.model('members').create(member))

const seedMembersInfo = () => db.Promise.map([
	{twitter: 'RosaDeLauro', facebook: 'CongresswomanRosaDeLauro', website: 'https://delauro.house.gov', phone: '202-225-3661', office: '', memberId: 1},
	{twitter: 'RepLloydDoggett', facebook: 'lloyddoggett', website: 'https://doggett.house.gov', phone: '202-225-4865', office: '', memberId: 2}
], memberInfo => db.model('member_info').create(memberInfo))


// const seedUsers = () => db.Promise.map([
//   {firstName: 'Gabe', lastName: 'Lebec', email: 'ILikeSwords@aol.com', isAdmin: false, streetAddress: '3 Javascript Lane', city: 'New York', state: 'NY', zipCode: 10001, creditCard: 1234567890123456, cvc: 123, password: "1234"},
//   {firstName: 'Hubert', lastName: 'Hansen', email: 'ImTheRealMonster@yahoo.com', isAdmin: false, streetAddress: '14-14 Hazen Street', city: 'New York', state: 'NY', zipCode: 11370, creditCard: 4321567890123456, cvc: 456, password: "1234"},
//   {firstName: 'Cookie', lastName: 'Monster', email: 'ImUsingThisSiteLikeTinder@hotmail.com', isAdmin: false, streetAddress: '123 Sesame Street', city: 'New York', state: 'NY', zipCode: 10002, creditCard: 4321567890123458, cvc: 789, password: "1234"},
//   {firstName: 'Professional', lastName: 'Man', email: 'admin@hotmail.com', isAdmin: true, streetAddress: '13 fake Street', city: 'New Bork', state: 'AA', zipCode: 12345, creditCard: 4321567390123458, cvc: 719, password: "1234"}
// ], user => db.model('users').create(user))

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
  .then((issue) => issue.addBills([4, 5]))
  .then(() => Issue.findById(2))
  .then((issue) => issue.addBills([1, 2, 3]))
  // .then(seedTransactions)
  // .then(transactions => console.log(`Seeded ${transactions.length} transactions OK`))
  // .then(seedCategories)
  // .then(categories => console.log(`Seeded ${categories.length} categories OK`))
  // .then(() => Product.findById(1))
  // .then((product) => product.addCategories([1, 2, 7]))
  // .then(() => Product.findById(2))
  // .then((product) => product.addCategories([1, 2, 7]))
  // .then(() => Product.findById(3))
  // .then((product) => product.addCategories([7]))
  // .then(() => Product.findById(4))
  // .then((product) => product.addCategories([6, 7]))
  // .then(() => Product.findById(5))
  // .then((product) => product.addCategories([4, 7]))
  // .then(() => Product.findById(6))
  // .then((product) => product.addCategories([3, 7]))
  // .then(() => Product.findById(7))
  // .then((product) => product.addCategories([1, 7]))
  // .then(() => Product.findById(8))
  // .then((product) => product.addCategories([6, 7]))
  // .then(() => Product.findById(25))
  // .then((product) => product.addCategories([8]))
  .catch(error => console.error(error))
  .finally(() => db.close());
