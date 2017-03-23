const db = require('../_db.js');

const Member = require('./member.js');
const Bill = require('./bill.js');
const MemberInfo = require('./member_info.js');
const Vote = require('./vote.js');
const Issue = require('./issue.js');
const IssueBill = require('./issue_bill.js');
const Cat = require('./cat.js');
const IssueCat = require('./issue_cat.js');

Member.hasOne(MemberInfo);
MemberInfo.belongsTo(Member);

Member.belongsToMany(Bill, {
	as: 'bill_votes',
	through: Vote
});
Bill.belongsToMany(Member, {
	as: 'member_votes',
	through: Vote
});

Member.hasMany(Vote);
Vote.belongsTo(Member);

Bill.hasMany(Vote);
Vote.belongsTo(Bill);

Bill.belongsToMany(Issue, {
	as: 'issue_bills',
	through: IssueBill
});
Issue.belongsToMany(Bill, {
	as: 'issue_bills',
	through: IssueBill
});

Cat.belongsToMany(Issue, {
	as: 'issue_cats',
	through: IssueCat
});
Issue.belongsToMany(Cat, {
	as: 'issue_cats',
	through: IssueCat
});

module.exports = db;
