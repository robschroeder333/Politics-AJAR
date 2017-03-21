const db = require('../_db.js');

const Member = require('./member.js');
const Bill = require('./bill.js');
const MemberInfo = require('./memberInfo.js');
const Vote = require('./vote.js');
const Issue = require('./issue.js');
const Score = require('./score.js');
const MemberIssue = require('./memberIssue.js');

Member.hasOne(MemberInfo);
MemberInfo.belongsTo(Member);

Member.belongsToMany(Bill, {
	as: 'billVotes',
	through: Vote
});
Bill.belongsToMany(Member, {
	as: 'memberVotes',
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
	through: 'issueBills'
});
Issue.belongsToMany(Bill, {
	through: 'issueBills'
});

Member.belongsToMany(Issue, {
	as: 'memberIssue',
	through: MemberIssue
});


module.exports = db;
