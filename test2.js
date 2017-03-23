const fs = require('fs');



fs.readFile('catcodes.txt', 'utf-8', (err, data) => {
  if (err) throw err;
  const catCodes = [];
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
  console.log(catCodes);

});

