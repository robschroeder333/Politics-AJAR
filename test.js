const axios = require('axios');
const queryString = require('querystring');



/////////////////////////
//DONT RUN BOTH AT ONCE//
/////////////////////////

//KEYS
const MAPLIGHTapikey = ''; //remove before pushing to gitgub
const PROPUBLICAapikey = ''; //remove before pushing to gitgub


//MAPLIGHT//

//For getting list of all bills
const getAllBills = () => {
  const session = 109; //congressional session
  const jurisdiction = 'us';
  const include_organizations = 1; // 1 includes an array of organization's positions on that bill
  const has_organizations = 1; // 1 excludes bills where no organizations have taken positions

  axios.get(
    `http://maplight.org/services_open_api/map.bill_list_v1.json/?apikey=${MAPLIGHTapikey}&jurisdiction=${jurisdiction}&session=${session}&include_organizations=${include_organizations}&has_organizations=${has_organizations}`)
  .then((response) =>
    console.log(response.data)
  )
  .catch(err => console.log(err));
};


//PRO PUBLICA//

//For getting list of members
const getMembers = () => {
  const congressNum = 115; //115 is the current congress
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
    console.log(officials);
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
