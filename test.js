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
  .then((response) =>
    console.log(response.data)
  )
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
        state: member.state
      });
    });
    allMembers = officialsS;
    // console.log(response.data.results[0].members);
    // console.log(officials)
    // roles does not exist. election year is available under next_election
    // find out if distrit is only in house
  })
  .then(() => {
    chamber = 'house'
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
          });
        });
        allMembers = allMembers.concat(officialsH)
        return allMembers;
      })

   console.log('final', allMembers)
   // return allMembers;
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
    // console.log('wtf', response)
    // if (response.results[0].roles[0].chamber === "House") {
    //     return response.results[0].roles[0].district;
    // }
    // else {
    //   return null;
    // }
  })
}

const combineMembersToVotes = (arrayOfMembers) => {
// console.log('hi', arrayOfMembers)
 return arrayOfMembers.map((member) => {
    // console.log(member)

    member.district = getMembersDistrict(member.ppid)
  })
}


//For getting a single member's positions on all bills they have voted on (mapped for tighter formatting)
const getMembersPositions = (memberId) => {
  // const memberId = 'C000984';//'C000984'//Representative Cummings [D] Maryland, district 7
                             //'S000033'//Senator Sanders [D] Vermont

  axios.get(
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
              year: vote.date.split('-')[0]
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
      Promise.all(positionsWithOrgs)
      .then((newposwithorgs) => console.log(newposwithorgs));//this is just an example to show how to get the data within the bill object
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

getMembers().then((members) => combineMembersToVotes(members))
// getMembersPositions();// this now uses getAllOrganizationsForBill within
// getAllOrganizationsForBill("h", 7);
// getAllBills();
