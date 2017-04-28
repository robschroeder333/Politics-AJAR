'use strict'; // eslint-disable-line semi

const db = require('./models');
const Issue = db.model('issues');
const Member = db.model('members');
const Vote = db.model('votes');
const Bill = db.model('bills');
const Cat = db.model('cats');
var Promise = require('bluebird');
const fs = require('fs');

//Api data
// const allData = require('../apiData');
// const allDataIssues = require('../apiData').getIssues();
const backup = require('../backup.json');
const synced = db.sync({force: true});
const allData = synced.then(() => backup);

//formatting catcodes for 'issues' seeding
const allDataIssues = new Promise((resolve, reject) => {
  fs.readFile('catcodes.txt', 'utf-8', (err, data) => {
    if (err) reject(err);
    let catCodes = [];
    let rows = data.split('\n');
    const columns = rows.shift().split('\t');
    for (let i = 0; i < rows.length; i++) {
      const splitRow = rows[i].split('\t');
      const codeObj = {};
      for (let ii = 0; ii < splitRow.length; ii++) {
        codeObj[columns[ii]] = splitRow[ii];
      }
      catCodes.push(codeObj);
    }
    catCodes.pop();
    resolve(catCodes);
  });
});

//Seed functions
const seedIssues = (issues) => db.Promise.map(issues,
  (issue) => {
    const formattedIssue = {
      catCode: issue.Catcode,
      name: issue.Catname
    };
    return db.model('issues').create(formattedIssue);
});
// const seedIssues = () => db.Promise.map([
//  {catCode: 'J6100', name: 'Anti-Guns'},
//  {catCode: 'J6200', name: 'Pro-Guns'}
// ], issue => db.model('issues').create(issue));

const seedCats = (categories) => {
  let uniqueCategories = [];
  let visitedCategories = {};
  for (let i = 0; i < categories.length; i++) {

    if (visitedCategories[categories[i].Catorder] === undefined) {
      visitedCategories[categories[i].Catorder] = categories[i].Catorder;
      uniqueCategories.push({catOrder: categories[i].Catorder, name: categories[i].Industry});
    }
  }
  // console.log(uniqueCategories)
  return db.Promise.map(uniqueCategories,
    (cat) => {
      return db.model('cats').create(cat);
    });
};

let billDupeCounter = 0;

const seedBills = (billsArray) => db.Promise.map(billsArray,
  (bill) => {

    // if (bill !== undefined && bill.prefix !== undefined && isNaN(bill.number) === false) {
      const formattedBill = {
      prefix: bill.prefix,
      number: bill.number,
      name: bill.name,
      year: bill.year,
      session: bill.session
      };
      return db.model('bills').create(formattedBill).catch(() => billDupeCounter++)
    // } else {
    //   return new Promise((resolve, reject) => resolve());
    // }

})

// const seedBills = () => db.Promise.map([
//  {prefix: 'H', number: '101', session: '115', name: 'Pro-Gun Bill of 2016', year: 2016},
//  {prefix: 'H', number: '102', session: '115', name: 'Another Pro-Gun Bill of 2016', year: 2016},
//  {prefix: 'H', number: '103', session: '115', name: 'A third Pro-Gun Bill of 2016', year: 2016},
//  {prefix: 'H', number: '104', session: '115', name: 'An Anti-Gun Bill of 2016', year: 2015},
//  {prefix: 'H', number: '105', session: '115', name: 'A second Anti-Gun Bill of 2016', year: 2016},
//   {prefix: 'H', number: '105', session: '115', name: 'A duplicate bill', year: 2016},
//   {prefix: 'H', number: '105', session: '115', name: 'Another duplicate bill', year: 2016}
// ], bill => db.model('bills').create(bill).catch(() => console.error('You made a duplicate request')))


// const updateBill = () => db.Promise.map([
//   {prefix: 'H', number: '105', session: '115', name: 'A duplicate bill', year: 2016}
// ], bill => db.model('bills').update(bill))

const seedMembers = (members) => db.Promise.map(members,
  (member) => {
    const formattedMember = {
      firstName: member.first_name,
      middleName: member.middle_name,
      lastName: member.last_name,
      ppid: member.ppid,
      party: member.party,
      chamber: member.chamber,
      state: member.state,
      district: member.district,
      electionYear: member.election_year
    };
    return db.model('members').create(formattedMember);
})

// const seedMembers = () => db.Promise.map([
//  {firstName: 'Rosa', middleName: null, lastName: 'DeLauro', ppid: 'D000216', party: 'D', chamber: 'house', state: 'CT', district: '3', electionYear: '2018'},
//  {firstName: 'Lloyd', middleName: null, lastName: 'Doggett', ppid: 'D000399', party: 'D', chamber: 'house', state: 'TX', district: '35', electionYear: '2018'},
//   {firstName: 'Darth', middleName: null, lastName: 'Vader-Mitchell', ppid: 'Z666999', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
//   {firstName: 'Luke', middleName: null, lastName: 'SkyWalker', ppid: 'Z666999', party: 'D', chamber: 'senate', state: 'MI', district: '89', electionYear: '2020'},
//   {firstName: 'Naruto', middleName: null, lastName: 'Johnuzaki', ppid: 'A123456', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
//   {firstName: 'Eric', middleName: null, lastName: 'Fromm', ppid: 'A183921', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
//   {firstName: 'Van', middleName: null, lastName: 'Helsing', ppid: 'B183819', party: 'D', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
//   {firstName: 'Sasuke', middleName: null, lastName: 'Brother', ppid: 'C183839', party: 'D', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},
//   {firstName: 'Bro', middleName: null, lastName: 'Mo-Sapiens', ppid: 'D183912', party: 'I', chamber: 'senate', state: 'NY', district: '69', electionYear: '2020'},

// ], member => db.model('members').create(member))

const seedWrongMembers = () => db.Promise.map([
  {firstName: 'Ted', middleName: null, lastName: 'Danson', ppid: 'D000217', party: 'I', chamber: 'house', state: 'CO', district: '4', electionYear: '2018'},
  {firstName: 'Jake', middleName: 'Fred', lastName: 'Nike', ppid: 'D000399', party: 'R', chamber: 'house', state: 'TN', district: '32', electionYear: '2018'}
], member => db.model('members').create(member));

const seedMembersInfo = (members) => db.Promise.map(members,
  (member) => {
    const memberInfo = {
      twitter: member.twitter,
      facebook: member.facebook,
      website: member.website,
      phone: member.phone,
      office: member.office
    };
    return db.model('member_info').create(memberInfo);
});

// const seedMembersInfo = () => db.Promise.map([
//     {twitter: 'RosaDeLauro', facebook: 'CongresswomanRosaDeLauro',
// website: 'https://delauro.house.gov', phone: '202-225-3661', office: '', memberId: 1},
//     {twitter: 'RepLloydDoggett', facebook: 'lloyddoggett', website: 'https://doggett.house.gov', phone: '202-225-4865', office: '', memberId: 2}
// ], memberInfo => db.model('member_info').create(memberInfo))



var data;
var issuesData;

const trace = tracer => pVal => {
  console.log(typeof tracer === 'function' ? tracer(pVal) : tracer);
  return pVal;
};



/////////////////////////////////
//////SEEDIN BEGINS HERE/////////
/////////////////////////////////


const issuesSeeded = synced
  .then(() => allDataIssues)
  .then((issues) => {
    issuesData = issues;
    return seedIssues(issues);
  })
  .then(trace(issues => `Seeded ${issues.length} issues OK`));


// const seedIssuesUsingAsyncFn = async function () {
//   await db.sync({force: true})
//   const issues = await allData.getIssues();
//   await seedIssues(issues);
//   console.log(`Seeded ${issues.length} issues OK`)
// }

// const issuesSeeded = seedIssuesUsingAsyncFn()

// const membersSeeded = allData.getData()
const membersSeeded = allData
  .then((members) => {
    data = members;
    return seedMembers(members);
  })
  .then(members => console.log(`Seeded ${members.length} members OK`))

const issuesAndMembersReady = Promise.all([issuesSeeded, membersSeeded]);

const memberInfoSeeded = issuesAndMembersReady
  .then(() => {
    return seedMembersInfo(data);
  })
  .then(memberInfoSeeded => {
    Member.findAll()
    .then((membersArray) => {
      membersArray.map(member => member.setMember_info(member.id));
    })
    return memberInfoSeeded;
  })
  .then(memberInfo => console.log(`Seeded ${memberInfo.length} memberInfo OK`))

const billsSeeded = issuesAndMembersReady
.then(() => {
    let billsArray = [];
    data.forEach(member => {
      billsArray = billsArray.concat(member.positions);
    });
    return seedBills(billsArray);
  })
  .then(bills => console.log(`Seeded ${bills.length - billDupeCounter} bills OK`))

const categoriesSeeded = billsSeeded
  .then(() => seedCats(issuesData))
  .then(cat => console.log(`Seeded ${cat.length} categories OK`))

const associatingIssuesToCategories = categoriesSeeded
  .then(() => {
    return issuesSeeded;
  })
  .then(fetchedIssues => {
    let count = 0;
    const connectedIssuesWithCategories = fetchedIssues.map(issue => {
      const issueCatcode = issue.dataValues.catCode;
      let index = -1;
      for (let i = 0, len = issuesData.length; i < len; i++) {
        if (issuesData[i].Catcode === issueCatcode) {
          index = i;
          break;
        }
      }
      return Cat.findOne({where: {catOrder: issuesData[index].Catorder}})
      .then((fetchedCategory) => {
        count++;
        if (count % 10 === 0) console.log(`Linked ${count} issues and categories`);
        return issue.addIssue_cat(fetchedCategory, {plusOrMinus: '+'});
      });
    });
    return Promise.all(connectedIssuesWithCategories);
  })
  .then(trace('Associated all issues and categories'));

// const associatingIssuesToBills = associatingIssuesToCategories
//   .then(() => {
//     const completingMemberAssociations = data.map(member => {
//       const arrayOfAssociationPromises = member.positions.map((bill) => {
//         let targetBill = Bill.findOne({where: {
//           prefix: bill.prefix,
//           number: bill.number,
//           session: bill.session
//         }})
//         const issuePromises = bill.orgs.map((org) => {
//           // console.log(org);
//           return Issue.findOne({where: {catCode: org.organizationType}});
//         })
//         const fetchingIssues = Promise.all(issuePromises)
//         return Promise.all([targetBill, fetchingIssues])
//           .then(([fetchedBill, fetchedIssues]) => {
//             // console.log(fetchedBill.dataValues);
//             // console.log(fetchedIssues)
//             const notNullIssues = fetchedIssues.filter(issue => !!issue);

//             const addedIssues = Promise.map(notNullIssues, issue => {
//               let issuePosition = '';
//               for (let i = 0; i < bill.orgs.length; i++) {
//                 if (bill.orgs[i].organizationType === issue.dataValues.catCode) {
//                   if (bill.orgs[i].disposition.toLowerCase() === 'support') {
//                     issuePosition = 'for';
//                   } else if (bill.orgs[i].disposition.toLowerCase() === 'oppose') {
//                     issuePosition = 'against';
//                   } else {
//                     console.log("disposition, unknown")
//                   }
//                 }
//               //add issuePosition as value passed into the options object

//                 return fetchedBill.addIssue_bills(issue, {forOrAgainst: issuePosition})
//               }
//             }, {concurrency: 1})

//             // return Promise.all(addedIssues);
//             return addedIssues;
//           })
//       })
//       return Promise.all(arrayOfAssociationPromises);
//     });
//     return Promise.all(completingMemberAssociations);
//   })

const issuesByCatCode = {};
const memoizedFetchIssue = catCode => {
  if (issuesByCatCode[catCode]) return issuesByCatCode[catCode];
  const issuePromise = Issue.findOne({where: {catCode}})
  issuePromise
  .then(() => {
    issuesByCatCode[catCode] = issuePromise;
  });
  return issuePromise;
};

const billsByToken = {};
const memoizedFetchBill = (prefix, number, session) => {
  const token = `p${prefix}_n${number}_s${session}`;
  if (billsByToken[token]) return billsByToken[token];
  const billPromise = Bill.findOne({where: {
    prefix,
    number,
    session
  }});
  billPromise
  .then(() => {
    billsByToken[token] = billPromise;
  });
  return billPromise;
};

const associatingIssuesToBills = associatingIssuesToCategories
  .then(trace('association issues to bills'))
  .then(() => {
    let billCount = 0;
    const completingMemberAssociations = data.map((member, memberIdx) => {
      const arrayOfAssociationPromises = member.positions.map((bill) => {
      //  if (bill !== undefined && bill.prefix !== undefined && isNaN(bill.number) === false) {
        let targetBill = memoizedFetchBill(bill.prefix, bill.number, bill.session);
        if (!bill.orgs) console.log('bill has no orgs ', bill, member.last_name);
        const issuePromises = bill.orgs.map((org) => {
          // console.log(org);
          return memoizedFetchIssue(org.organizationType);
        });
        const fetchingIssues = Promise.all(issuePromises);
        return Promise.all([targetBill, fetchingIssues])
        .then(([fetchedBill, fetchedIssues]) => {
          if (++billCount % 10 === 0) console.log(`fetched issues for ${billCount} bills`);
          // console.log(fetchedBill.dataValues);
          const notNullIssues = fetchedIssues.filter(issue => {
          //  console.log("issue id: ", issue.dataValues);
           return !!issue;
          });
          // console.log('length is: ', notNullIssues.length);
          if (notNullIssues.length === 0 || fetchedBill === null){
            return;
          }
          const addedIssues = notNullIssues.map(issue => {
            let issuePosition = '';
            for (let i = 0; i < bill.orgs.length; i++) {
              if (bill.orgs[i].organizationType === issue.dataValues.catCode) {
                if (bill.orgs[i].disposition.toLowerCase() === 'support') {
                  issuePosition = 'for';
                } else {
                  issuePosition = 'against';
                }
              }
            }
            //add issuePosition as value passed into the options object
            return fetchedBill.addIssue_bills(issue, {forOrAgainst: issuePosition})
            .catch(() => {});
          });
          return Promise.all(addedIssues);
          // .then(trace(`added issues for member ${memberIdx}`));
        });
      });
      return Promise.all(arrayOfAssociationPromises)
      .then(trace(`all bills added for member ${memberIdx}`));
    });
    return Promise.all(completingMemberAssociations)
    .then(trace('all bills added for all members'));
  });




  const associatingMembersToBills = associatingIssuesToBills
  .then(() => {
    const completingMemberAssociations = data.map(member => {

      const targetMember = Member.findOne({where: {
          ppid: member.ppid
        }});

      const arrayOfAssociationPromises = member.positions.map((bill) => {
        // if (bill !== undefined && bill.prefix !== undefined && isNaN(bill.number) === false) {
          return memoizedFetchBill(bill.prefix, bill.number, bill.session);
        // } else {
        //   return new Promise((resolve, reject) => resolve());
        // }
      });
      const arrayForBills = Promise.all(arrayOfAssociationPromises);
      return Promise.all([targetMember, arrayForBills])
      .then(([fetchedMember, fetchedBills]) => {
        // console.log(fetchedBills[0]);

        const addedBills = fetchedBills.map((bill, i) => {
          // console.log(member.positions[i].position)
          // if (member.positions[i].position) {
          return fetchedMember.addBill_vote(bill, {position: member.positions[i].position})
          .catch(() => {});
          // } else {
          //   return new Promise((resolve, reject) => resolve());
          // }
        });
        return Promise.all(addedBills);
      });

    });
    return Promise.all(completingMemberAssociations);
  });


  Promise.all([memberInfoSeeded, associatingMembersToBills])
  .catch(error => console.error(error))
  .finally(() => {
    db.close();
    return null;
  });

  // .then(() => Issue.findById(1))
  // .then((issue) => issue.addIssue_bills([4, 5]))
  // .then(() => Bill.findById(2))
  // .then((bill) => bill.addIssue_bills([1, 2, 3]))


  // .then(seedCats)
  // .then(cat => console.log(`Seeded ${cat.length} catagories OK`))
  // .then(() => Cat.findById(1))
  // // .then((cat) => console.log(cat))
  // .then((cat) => {cat.addIssue_cat(1, {plusOrMinus: '+'})
  // return cat})
  // .then((cat) => cat.addIssue_cat(2, {plusOrMinus: '-'}))
  // // .then(() => Cat.findById(2))
  // // .then((cat) => cat.addIssue_cats([1]))
  // .then(() => Member.findById(1))
  // .then((member) => member.addBill_vote(1, {position: 'yes'}))
  // .then(() => Member.findById(1))
  // .then((member) => member.addBill_vote(2, {position: 'no'}))
  // .then(() => Member.findById(1))
  // .then((member) => member.addBill_vote(3, {position: 'yes'}))
  // .then(() => Member.findById(1))
  // .then((member) => member.addBill_vote(4, {position: 'yes'}))
  // .then(() => Member.findById(1))
  // .then((member) => member.addBill_vote(5, {position: 'no'}))
  // .then(() => Member.findById(2))
  // .then((member) => member.addBill_vote(1, {position: 'no'}))
  // .then(() => Member.findById(2))
  // .then((member) => member.addBill_vote(2, {position: 'no'}))
  // .then(() => Member.findById(2))
  // .then((member) => member.addBill_vote(3, {position: 'no'}))
  // .then(() => Member.findById(2))
  // .then((member) => member.addBill_vote(4, {position: 'no'}))
  // .then(() => Member.findById(2))
  // .then((member) => member.addBill_vote(5, {position: 'no'}))

  // // .then(() => Issue.findById(1))
  // // .then((issue) => issue.getIssue_bills())
  // // .then(billArr => {billArr.forEach(bill => console.log(bill.id));})

  // .then(() => Member.findById(1))
  // .then(member => member.getIssueScore(1))
  // .then(score => console.log('Lloyd anti-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  // .then(() => Member.findById(1))
  // .then(member => member.getIssueScore(2))
  // .then(score => console.log('Lloyd pro-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  // .then(() => Member.findById(2))
  // .then(member => member.getIssueScore(1))
  // .then(score => console.log('Rosa anti-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  // .then(() => Member.findById(2))
  // .then(member => member.getIssueScore(2))
  // .then(score => console.log('Rosa pro-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  // .then(() => Member.findById(1))
  // .then(member => member.getIssueScore(1, 2012, 2015))
  // .then(score => console.log('Lloyd pre-2016 anti-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))
  // .then(() => Member.findById(1))
  // .then(member => member.getIssueScore(2, 2012, 2015))
  // .then(score => console.log('Lloyd pre-2016 pro-gun vote record is:', score[0], 'yes votes out of', score[1], 'total votes'))

  // .then(() => Member.findById(1))
  // .then(member => member.getCatScore(1, 2012, 2016))
  // .then(score => console.log("Lloyd's array of scores for alignment to possible user positions on Gun Control are:\n", score, '\nIn order, these alignments are if the user\n [strongly disagrees, disagrees, is neutral, agrees, strongly agrees] with the issue.'))

  // .then(() => Bill.findById(5))
  // .then(bill => bill.update({name: 'A new name!'}))

  // // .then(seedWrongMembers)
  // // .then(members => console.log(`Seeded ${members.length} members OK`))
