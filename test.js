//for ease of use functions to call are at the bottom

const axios = require('axios');
const queryString = require('querystring');
const keys = require('./keys.js');//add this file (have it export the api keys) and add to gitignore


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
    // console.log(response.data)
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
        position: organization.disposition,
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
              number: billObj.billNum,
              name: vote.bill.title,
              question: vote.question,
              position: vote.position,
              orgs: null,
              year: parseInt(vote.date.split('-')[0], 10)
            });
          }
      });
      positions = positions.filter(ele => ele !== undefined);

      //below is how we tie in the organizations that are involved with a bill
      const positionsWithOrgs = positions.map(bill => {
        return getAllOrganizationsForBill(bill.prefix, bill.number)
        .then(orgsArray => {
          bill.orgs = orgsArray;
          return bill;
        })
        .catch(err => console.log(err));
      })
      return Promise.all(positionsWithOrgs)
      // .then((newposwithorgs) => console.log(newposwithorgs));
  })
  .catch(err => console.log(err));
};

//converts the bills measure info from propublica to maplight
const billNumberFormatter = (billNumberString) => {
  const splitBill = billNumberString.split(' ');
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
}




////////////////////////
//DONT RUN ALL AT ONCE//
////////////////////////

let AllInformation = [];

getMembers()
.then((members) => {
  //cannot run on all members at once. set up multiple calls.
  // console.log(members);
  const members1 = members.slice(0, 100);
  const members2 = members.slice(100, 200);
  const members3 = members.slice(200, 300);
  const members4 = members.slice(300, 400);
  const members5 = members.slice(400, 500);
  const members6 = members.slice(500);
  //promises
  const p1 = combineMembersToVotes(members1);

  // i need to delay this but also have the promise.all know what to wait for
  setTimeout(() => {
    const p2 = combineMembersToVotes(members2);
  }, 120000)
  // const p3 = combineMembersToVotes(members3);
  // const p4 = combineMembersToVotes(members4);
  // const p5 = combineMembersToVotes(members5);
  // const p6 = combineMembersToVotes(members6);

  Promise.all([p1, p2])//, p3, p4, p5, p6])
  .then(finalMembers => {
    AllInformation = AllInformation.concat(finalMembers[0], finalMembers[1])//, finalMembers[2], finalMembers[3], finalMembers[4], finalMembers[5]);

    console.log(AllInformation);
  })
  .catch(err => console.log(err));
})
.catch(err => console.log(err));

// getMembersPositions('C000984')
// .then(arrOfBills => console.log(arrOfBills))
// getAllOrganizationsForBill("h", 7);

// getAllBills();
