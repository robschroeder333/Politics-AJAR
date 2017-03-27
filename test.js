//for ease of use functions to call are at the bottom

const axios = require('axios');
const keys = require('./keys.js');//add this file (have it export the api keys) and add to gitignore
const fs = require('fs');

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
  // const billType = 'hj';/*  'h' House Bill (i.e. H.R.)
  //                           'hr' House Resolution (i.e. H.Res.)
  //                           'hj' House Joint Resolution (i.e. H.J.Res.)
  //                           'hc' House Concurrent Resolution (i.e. H.Con.Res.)
  //                           's' Senate Bill (i.e. S.)
  //                           'sr' Senate Resolution (i.e. S.Res.)
  //                           'sj' Senate Joint Resolution (i.e. S.J.Res.)
  //                           'sc' Senate Concurrent Resolution (i.e. S.Con.Res.) */
  // const billNum = 38;//130;

  return axios.get(
    `http://maplight.org/services_open_api/map.bill_positions_v1.json/?apikey=${MAPLIGHTapikey}&jurisdiction=${jurisdiction}&session=${congressNum}&prefix=${billType}&number=${billNum}`)
  .then((response) => {
    const organizations = response.data.bill.organizations.map(organization => ({
        name: organization.name,
        disposition: organization.disposition,
        organizationType: organization.catcode //this can be used to determine the stance of the bill itself (i think) site: http://www.opensecrets.org/downloads/crp/CRP_Categories.txt
      })
    );
    return organizations;
    // console.log(organizations);
  })
  .catch(err => console.log(err));
};


//PRO PUBLICA//

//For getting list of members
const getMembers = () => {
  let chamber = 'senate'; // 'house' or 'senate'

  return axios.get(
    `https://api.propublica.org/congress/v1/${congressNum}/${chamber}/members.json`,{
    headers: {
      'X-API-Key': PROPUBLICAapikey
    }
  })
  .then((response) => {
    const officialsS = response.data.results[0].members.map(member => {
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
    });
    allMembers = officialsS;
    // console.log(response.data.results[0].members);
    // console.log(officials)
    // roles does not exist. election year is available under next_election
    // find out if distrit is only in house
  })
  .then(() => {
    chamber = 'house';
    return axios.get(
        `https://api.propublica.org/congress/v1/${congressNum}/${chamber}/members.json`,{
        headers: {
          'X-API-Key': PROPUBLICAapikey
        }
      })
      .then((response) => {
        const officialsH = response.data.results[0].members.map(member => {
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
        });
        allMembers = allMembers.concat(officialsH);
        return allMembers;
      });
  })
  .catch(err => console.log(err));
};


const getMembersDistrict = (memberId) => {

 return axios.get(
    `https://api.propublica.org/congress/v1/members/${memberId}.json`,{
    headers: {
      'X-API-Key': PROPUBLICAapikey
    }
  })
  .then((response) => {
    // console.log(response.data.results[0] && response.data.results[0].roles[0].chamber === "House");
    if (response.data.results[0] && response.data.results[0].roles[0].chamber === "House") {
      // console.log(response.data.results[0].roles[0].district)
      return response.data.results[0].roles[0].district;
    } else {
      return null;
    }
  })
  .catch(err => console.log(err));
};

//only adds district right now
const combineMembersToVotes = (arrayOfMembers) => {
// console.log(arrayOfMembers);
  let membersWithDistrict = arrayOfMembers.map((member) => {

    return getMembersDistrict(member.ppid)
    .then((district) => {
      member.district = district;
    })
    .then(() => {
      return getMembersPositions(member.ppid)
      .then((positions) => {
        member.positions = positions;
        // console.log(member);
        return member;//this is correct!!!!!!!!!!!!!!!
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  });

  // console.log("testing ",membersWithDistrict[0]);
  return Promise.all(membersWithDistrict);

};

//converts the bills measure info from propublica to maplight
const billNumberFormatter = (billNumberString) => {
  // console.log(billNumberString);
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
  })
};

//For getting a single member's positions on all bills they have voted on (mapped for tighter formatting)
const getMembersPositions = (memberId) => {
  // const memberId = 'C000984';//'C000984'//Representative Cummings [D] Maryland, district 7
                             //'S000033'//Senator Sanders [D] Vermont

  return axios.get(
    `https://api.propublica.org/congress/v1/members/${memberId}/votes.json`,{
    headers: {
      'X-API-Key': PROPUBLICAapikey
    }
  })
  .then((response) => {
    let positions = response.data.results[0].votes.map(vote => {
          if (vote.bill.title !== undefined
              && vote.question.toLowerCase().includes('passage')) {
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
      positions = positions.filter(ele => ele !== undefined);

      //below is how we tie in the organizations that are involved with a bill
      const positionsWithOrgs = positions.map(bill => {
        return getAllOrganizationsForBill(bill.prefix, bill.number)
        .then(orgsArray => {
          bill.orgs = orgsArray;
          console.log(orgsArray)
          return bill;
        })
        .catch(err => console.log(err));
      })
      return Promise.all(positionsWithOrgs)

  })
  .catch(err => console.log(err));
};



//combines all slices of the arrayOfMembers recursively (combining individual member to their votes)
const doCombine = (memberPieces, lastI, nextI, accReturn, resolve, reject) => {
  if (nextI === lastI + 1) {
    console.log("Finished Processing");

    //store data as variable (array)
    resolve(accReturn);

    //write data to text file
    // fs.writeFile('backup.txt', JSON.stringify(accReturn), (err) => {
    //   if (err) throw err;
    //   console.log('Save Complete');
    // });
  } else {
    console.log("Processing batch: ", nextI);
    combineMembersToVotes(memberPieces[nextI])
    .then((finalMembers) => {
      accReturn = accReturn.concat(finalMembers);
      setTimeout(() => doCombine(memberPieces, lastI, nextI + 1, accReturn, resolve, reject), nextI * 60 * 1000);
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
    memberPieces.push(members.slice(0, 5));//0  ///// correct 5 to 50
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
    doCombine(memberPieces, 0, 0, [], resolve, reject);
  })
  .catch(err => console.log(err));
});



//api test calls
// getMembersPositions('A000360')//.then(data => console.log(data));
// getAllOrganizationsForBill("h", 7);
// getAllBills();

const membersAndVotes = () => {
  return allData;
};
const categories = () => {
  return issues;
};

module.exports = {
  getData: membersAndVotes,
  getIssues: categories
};
