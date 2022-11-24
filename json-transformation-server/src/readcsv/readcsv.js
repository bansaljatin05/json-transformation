const csv = require('csv-parser')
var jsonata = require("jsonata");
const fs = require('fs')
const results = [];
const sourceJSON={
    "id": "122-34-6543",
    "region": "NA",
    "firstName": "Leanne",
    "lastName": "Graham",
    "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874"
    },
    "occupation": "self-employed",
    "age": 29,
    "loanHistory": [
        {
            "princicpal": 40000,
            "periodInYears": "3",
            "rateOfInterest": 10,
            "collateral": [
                {
                    "assetName": "property",
                    "estimatedValues": 7000
                }
            ]
        },
        {
            "princicpal": 140000,
            "periodInYears": "4",
            "rateOfInterest": 12,
            "isCommercial": true,
            "collateral": [
                {
                    "assetName": "condo",
                    "estimatedValues": 30000
                }
            ]
        },
        {
            "princicpal": 60000,
            "periodInYears": "4",
            "rateOfInterest": 12
        }
    ],
    "liquid_assets": 100000,
    "non_liquid_assets": 300000
}
const targetJSON={}
let specJSONString="{";


fs.createReadStream('../../../data/sample_3/mapping.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results);
    for(let i=0 ;i<results.length;i++){
        // targetJSON[results[i][" Target"]]=sourceJSON[results[" Source"]]
        // Object.keys(results[i]).forEach()
        let value = results[i][" Source"];
        if(!value.includes('(')){
        //console.log(value);
        value = value.trim();
        let a =  value.split("+").map(v=>v.trim().replace(".",""));
        //console.log(a)
        let sourceObj=a.join("&");
        let ll=JSON.stringify(sourceObj)
        console.log(JSON.parse(ll))
        
        targetJSON[results[i].Target]=`${JSON.parse(ll)}`

        specJSONString+=`\'${results[i].Target}\'`
        specJSONString+=":";
        specJSONString+=JSON.parse(ll);
        if(i==results.length-1){
            break;
        }
        specJSONString+=",";
        
        console.log(specJSONString);
       // console.log(targetJSON[results[i].Target]);
    }
}
if(specJSONString[specJSONString.length-1]){
    specJSONString=specJSONString.slice(0,-1)
}
    specJSONString+="}";
    let a="";

    console.log(specJSONString);
    
    var expression = jsonata(specJSONString);
    var result = expression.evaluate(sourceJSON);
    console.log(result)
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },

    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
