const axios = require('axios');




/////////////////////////
//DONT RUN BOTH AT ONCE//
/////////////////////////

// maplight method
var session = 109;
var jurisdiction = 'us';
var apikey = 'INSERT API';

axios.get(
  `http://maplight.org/services_open_api/map.bill_list_v1.json/?apikey=${apikey}&jurisdiction=${jurisdiction}&session=${session}`,{
})
.then((response) =>
  console.log(response)
)
.catch(err => console.log(err));

//pro publica method
axios.get(
  `https://api.propublica.org/congress/v1/115/senate/members.json`,{
  headers: {
    'X-API-Key': 'INSERT API'
  }
})
.then((response) =>
  console.log(response)
)
.catch(err => console.log(err));
