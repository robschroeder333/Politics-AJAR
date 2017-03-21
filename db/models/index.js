const db = require('../_db.js');

const Member = require('./member.js');
const Bill = require('./bill.js');
const MemberInfo = require('./member_info.js');
const Vote = require('./vote.js');
const Issue = require('./issue.js');
const Score = require('./score.js');
const MemberIssue = require('./member_issue.js');

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
Vote.belongsToMany(Issue, {
	as: 'score',
	through: Score
});

Bill.hasMany(Vote);
Vote.belongsTo(Bill);

Bill.belongsToMany(Issue, {
	through: 'issue_bills'
});
Issue.belongsToMany(Bill, {
	through: 'issue_bills'
});

Member.belongsToMany(Issue, {
	as: 'member_issue',
	through: MemberIssue
});


module.exports = db;
