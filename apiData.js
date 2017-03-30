//for ease of use functions to call are at the bottom

const axios = require('axios');
const keys = require('./keys.js');//add this file (have it export the api keys) and add to gitignore
const fs = require('fs');
var Promise = require('bluebird');

//KEYS
const MAPLIGHTapikey = keys.mapLight;
const PROPUBLICAapikey = keys.proPub;


//shared variables
const congressNum = 115; //115 is the current congress
let allMembers;


//MAPLIGHT//

//shared variables (for maplight only)
const jurisdiction = 'us';

//For getting list of all bills
const getAllBills = () => {
  const include_organizations = 1; // 1 includes an array of organization's positions on that bill
  const has_organizations = 1; // 1 excludes bills where no organizations have taken positions

  axios.get(
    `http://maplight.org/services_open_api/map.bill_list_v1.json/?apikey=${MAPLIGHTapikey}&jurisdiction=${jurisdiction}&session=${congressNum}&include_organizations=${include_organizations}&has_organizations=${has_organizations}`)
  .then((response) => {
    console.log(response.data)
  })
  .catch(err => console.log(err));
};

//For getting list of all organizations (support/opposition) relating to one bill
const getAllOrganizationsForBill = (billType, billNum) => {
  return axios.get(
    `http://maplight.org/services_open_api/map.bill_positions_v1.json/?apikey=${MAPLIGHTapikey}&jurisdiction=${jurisdiction}&session=${congressNum}&prefix=${billType}&number=${billNum}`)
  .then((response) => {
    const organizations = response.data.bill.organizations.map(organization => ({
        name: organization.name,
        disposition: organization.disposition,
        organizationType: organization.catcode
      })
    );
    return organizations;
  })
  .catch(err => console.log(err));
};


//PRO PUBLICA//

const rawMemberToFormatted = chamber => member => {
  return ({
    ppid: member.id,
    first_name: member.first_name,
    middle_name: member.middle_name,
    last_name: member.last_name,
    party: member.party,
    chamber: chamber,
    election_year: member.next_election,
    district: null,
    state: member.state,
    twitter: member.twitter_account,
    facebook: member.facebook_account,
    website: member.url,
    office: member.office,
    phone: member.phone
  });
};

const selectRawMembers = response => response.data.results[0].members;

//For getting list of members
const getMembers = () => {
  let chamber = 'senate';
  console.log('getting senate');
  return axios.get(
    `https://api.propublica.org/congress/v1/${congressNum}/${chamber}/members.json`,
    { headers: { 'X-API-Key': PROPUBLICAapikey } }
  )
  .then((response) => {
    console.log(`Fetched ${selectRawMembers(response).length} senate members`);
    const officialsS = selectRawMembers(response).map(rawMemberToFormatted('senate'));
    allMembers = officialsS;
    // ----
    console.log('getting house');
    chamber = 'house';
    return axios.get(
      `https://api.propublica.org/congress/v1/${congressNum}/${chamber}/members.json`,
      { headers: { 'X-API-Key': PROPUBLICAapikey }
    });
  })
  .then((response) => {
    console.log(`Fetched ${selectRawMembers(response).length} house members`);
    const officialsH = selectRawMembers(response).map(rawMemberToFormatted('house'));
    allMembers = allMembers.concat(officialsH);
    return allMembers;
  });
};

const getMembersDistrict = (memberId) => {
  return axios.get(
    `https://api.propublica.org/congress/v1/members/${memberId}.json`,
    {
      headers: {
        'X-API-Key': PROPUBLICAapikey
      }
    }
  )
  .then((response) => {
    if (response.data.results[0] && response.data.results[0].roles[0].chamber === "House") {
      return response.data.results[0].roles[0].district;
    } else {
      return null;
    }
  });
};

//converts the bills measure info from propublica to maplight
const billNumberFormatter = (billNumberString) => {
  const splitBill = billNumberString.split('.');
  const number = splitBill.pop();
  const tempType = splitBill.join('').toUpperCase();
  let newType;

  if (tempType === "HR"){
    newType= "h"
  }
  if (tempType === "HRES"){
    newType= "hr"
  }
  if (tempType === "HJRES"){
    newType= "hj"
  }
  if (tempType === "HCONRES"){
    newType= "hc"
  }
  if (tempType === "S"){
    newType= "s"
  }
  if (tempType === "SRES"){
    newType= "sr"
  }
  if (tempType === "SJRES"){
    newType= "sj"
  }
  if (tempType === "SCONRES"){
    newType= "sc"
  }

  return ({
    billType: newType,
    billNum: parseInt(number, 10)
  });
};

const combineOrgsToBills = (billsArray, stopI, nextI, accReturn, resolve, reject) => {
  if (nextI === stopI + 1) {
    console.log("Finished Processing that members batch of bills");
    resolve(accReturn);//store data as variable (array)
  } else {
    console.log("Processing bill: ", nextI);
    const currentBill = billsArray[nextI];
    getAllOrganizationsForBill(currentBill.prefix, currentBill.number)
    .then((finalMembers) => {
      accReturn = accReturn.concat(finalMembers);
      setTimeout(() => combineOrgsToBills(billsArray, stopI, nextI + 1, accReturn, resolve, reject), nextI * 60 * 1000);
    })
    .catch(reject);
  }
};

//For getting a single member's positions on all bills they have voted on (mapped for tighter formatting)
const getMembersPositions = (memberId) => {

  return axios.get(
    `https://api.propublica.org/congress/v1/members/${memberId}/votes.json`,{
    headers: {
      'X-API-Key': PROPUBLICAapikey
    }
  })
  .then((response) => {
    let positions = response.data.results[0].votes.map(vote => {
          if (vote.bill.title !== undefined) {
            const billObj = billNumberFormatter(vote.bill.number);
            return ({
              prefix: billObj.billType,
              number: billObj.billNum.toString(),
              name: vote.bill.title,
              question: vote.question,
              position: vote.position,
              orgs: null,
              year: parseInt(vote.date.split('-')[0], 10),
              session: vote.congress
            });
          }
      });

      positions = positions.filter(ele => {
        if (ele !== undefined && ele.prefix && ele.number) return true;
      });
      //maybe filter here?

      //below is how we tie in the organizations that are involved with a bill
      const positionsWithOrgs = Promise.map(positions, bill => {
          return getAllOrganizationsForBill(bill.prefix, bill.number)
          .then(orgsArray => {
            bill.orgs = orgsArray;
            return bill;
          })
          .catch(err => console.log(err));
    }, {concurrency: 1});
      return Promise.all(positionsWithOrgs);
  })
  .catch(err => console.log(err));
};

//only adds district right now
const combineMembersToVotes = (arrayOfMembers) => {
  let count = 0;
  let membersWithDistrict = arrayOfMembers.map((member) => {
    // could be parallel; sequencing to slow down API call rate
    return getMembersDistrict(member.ppid)
    .then((district) => {
      member.district = district;
      return getMembersPositions(member.ppid);
    })
    .then(positions => {
      member.positions = positions;
      count++;
      if (count % 10 === 0) console.log(`Got districts and votes for ${count} members`);
      return member;
    });
  });
  return Promise.all(membersWithDistrict);
};

//combines all slices of the arrayOfMembers recursively (combining individual member to their votes)
const doCombine = (memberPieces, stopI, nextI, accReturn, resolve, reject) => {
  if (nextI > stopI) {
    console.log('Finished Processing');

    //store data as variable (array)
    resolve(accReturn);

    //write data to text file
    fs.writeFile('backup.json', JSON.stringify(accReturn), (err) => {
      if (err) throw err;
      console.log('Save Complete');
    });
  } else {
    console.log("Processing batch: ", nextI);
    combineMembersToVotes(memberPieces[nextI])
    .then((finalMembers) => {
      console.log(`Combined members and votes for batch ${nextI}`);
      accReturn = accReturn.concat(finalMembers);
      const DELAY = stopI === nextI ? 0 : 90 * 1000;
      setTimeout(() => doCombine(memberPieces, stopI, nextI + 1, accReturn, resolve, reject),/* nextI */ DELAY);
    })
    .catch(reject);
  }
};

//formatting catcodes for 'issues' seeding
const issues = new Promise((resolve, reject) => {
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

const allData = new Promise((resolve, reject) => {


//////////When this runs 'last index' of 0 will only run through the first slice
//////////adjusting 'last index' up will activate each additional slice
//////////also slice one can be corrected, as indicated in the comment

  getMembers()
  .then((members) => {
    //cannot run on all members at once. set up slices for multiple calls.
    const memberPieces = [];
    memberPieces.push(members.slice(0, 50));//0
    memberPieces.push(members.slice(50, 100));//1
    memberPieces.push(members.slice(100, 150));//2
    memberPieces.push(members.slice(150, 200));//3
    memberPieces.push(members.slice(200, 250));//4
    memberPieces.push(members.slice(250, 300));//5
    memberPieces.push(members.slice(300, 350));//6
    memberPieces.push(members.slice(350, 400));//7
    memberPieces.push(members.slice(400, 450));//8
    memberPieces.push(members.slice(450, 500));//9
    memberPieces.push(members.slice(500));//10

    //(array, last index, next index, memoization array)
    doCombine(memberPieces, 10, 0, [], resolve, reject);
  })
  .catch(err => console.log(err));
});



//api test calls
// getMembersPositions('A000360')//.then(data => console.log(data));
// getAllOrganizationsForBill("h", 7);
// getAllBills();

// const membersAndVotes = () => {
//   return allData;
// };
const categories = () => {
  return issues;
};

module.exports = {
  // getData: membersAndVotes,
  getIssues: categories
};
