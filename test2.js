const fs = require('fs');
// const allData = require('./test');
const axios = require('axios');
const Promise = require('bluebird');

const hbills = [];
for (let i = 1; i < 20; i++){
  hbills.push('h' + i);
}
// console.log(hbills);
const billPromise = Promise.map(hbills, (billNum) => {
  return axios.get(`https://www.govtrack.us/data/congress/114/votes/2016/${billNum}/data.json`)
  .then((response) => response.data);
}, {concurrency: 1})
Promise.all(billPromise)
.then((bills) => {
  const filteredBills = bills.filter(bill => {
    // console.log(bill.category);
    return bill.type === 'On Passage of the Bill'
});
  // console.log(filteredBills);
  const formattedBills = filteredBills.map(bill => ({
    type: bill.bill.type,
    number: bill.bill.number,
    congress: bill.bill.congress,
    date: bill.date,
    name: bill.subject,
    votes: bill.votes
  }))
  console.log(formattedBills);
})



// fs.readFile('catcodes.txt', 'utf-8', (err, data) => {
//   if (err) throw err;
//   const catCodes = [];
//   let rows = data.split('\n');
//   const columns = rows.shift().split('\t');
//   for (let i = 0; i < rows.length; i++) {
//     const splitRow = rows[i].split('\t');
//     const codeObj = {};
//     for (let ii = 0; ii < splitRow.length; ii++) {
//       codeObj[columns[ii]] = splitRow[ii];
//     }
//     catCodes.push(codeObj);
//   }
//   console.log(catCodes);
// });

