//for ease of use functions to call are at the bottom

const axios = require('axios');
const queryString = require('querystring');
const keys = require('./keys');

//KEYS
const MAPLIGHTapikey = keys.mapLight; //remove before pushing to gitgub
const PROPUBLICAapikey = keys.proPub; //remove before pushing to gitgub


//shared variables
const congressNum = 115; //115 is the current congress


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
const getAllOrganizationsForBill = () => {
  const billType = 's'; /*  'h' House Bill (i.e. H.R.)
                          'hr' House Resolution (i.e. H.Res.)
                          'hj' House Joint Resolution (i.e. H.J.Res.)
                          'hc' House Concurrent Resolution (i.e. H.Con.Res.)
                          's' Senate Bill (i.e. S.)
                          'sr' Senate Resolution (i.e. S.Res.)
                          'sj' Senate Joint Resolution (i.e. S.J.Res.)
                          'sc' Senate Concurrent Resolution (i.e. S.Con.Res.)
                        */
  const billNum = 130;

  axios.get(
    `http://maplight.org/services_open_api/map.bill_positions_v1.json/?apikey=${MAPLIGHTapikey}&jurisdiction=${jurisdiction}&session=${congressNum}&prefix=${billType}&number=${billNum}`)
  .then((response) => {
    const organizations = response.data.bill.organizations.map(organization => ({
        name: organization.name,
        position: organization.disposition,
        organizationType: organization.catcode //this can be used to determine the stance of the bill itself (i think) site: http://www.opensecrets.org/downloads/crp/CRP_Categories.txt
      })
    );
    console.log(organizations);
  })
  .catch(err => console.log(err));
};


//PRO PUBLICA//

//For getting list of members
const getMembers = () => {
  const chamber = 'senate'; // 'house' or 'senate'

  axios.get(
    `https://api.propublica.org/congress/v1/${congressNum}/${chamber}/members.json`,{
    headers: {
      'X-API-Key': PROPUBLICAapikey
    }
  })
  .then((response) => {
    const officials = response.data.results[0].members.map(member => {
      return ({
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        party: member.party
      });
    });
    // console.log(officials);
    console.log(response.data.results[0].members);
  })
  .catch(err => console.log(err));
};

//For getting a single member's positions on all bills they have voted on (mapped for tighter formatting)
const getMembersPositions = () => {
  const memberId = 'C000984'; //Representative Cummings [D] Maryland, district 7
                // 'S000033'; //Senator Sanders [D] Vermont

  axios.get(
    `https://api.propublica.org/congress/v1/members/${memberId}/votes.json`,{
    headers: {
      'X-API-Key': PROPUBLICAapikey
    }
  })
  .then((response) => {
    const positions = response.data.results[0].votes.map(vote => {
        // if (vote.congress === 115) {
          return ({
            number: vote.bill.number,
            bill: vote.bill.title,
            question: vote.question,
            position: vote.position
          });
        // }
      });
    console.log(positions);
  })
  .catch(err => console.log(err));
};

////////////////////////
//DONT RUN ALL AT ONCE//
////////////////////////

// getAllBills();
// getAllOrganizationsForBill();
// getMembers();
getMembersPositions();
