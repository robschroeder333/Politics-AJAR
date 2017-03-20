const db = require('../_db.js');

const Member = require('./member.js');
const Bill = require('./bill.js');
const MemberInfo = require('./memberInfo.js')

Member.hasOne(MemberInfo);
MemberInfo.belongsTo(Member);

module.exports = db;
