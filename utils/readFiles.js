const fs= require('fs');
const neatCsv = require('neat-csv');

const readFile = async(file)=>{
   const data =fs.readFileSync(file, {encoding:'utf8',flags:'r'});
   return neatCsv(data);
}

module.exports=readFile