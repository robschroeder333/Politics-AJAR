const axios = require('axios');

axios.get(
  "https://api.propublica.org/congress/v1/115/senate/members.json",{
  headers: {
    'X-API-Key': 'apikeygoeshere....'
  }
}).then((response) => console.log(response.data.results));

