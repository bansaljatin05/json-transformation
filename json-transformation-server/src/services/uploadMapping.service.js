const jsonata = require('jsonata');
const httpStatus = require('http-status');
const { TransformVersions } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const { NumberAddition, StringConcat, shift, enumGenerator, IfElseResolver } = require('../utils/TransformUtils');
const ApiError = require('../utils/ApiError');

const sourceJSON = {
  id: '122-34-6543',
  region: 'NA',
  firstName: 'Leanne',
  lastName: 'Graham',
  address: {
    street: 'Kulas Light',
    suite: 'Apt. 556',
    city: 'Gwenborough',
    zipcode: '92998-3874',
  },
  occupation: 'self-employed',
  age: 29,
  loanHistory: [
    {
      princicpal: 40000,
      periodInYears: '3',
      rateOfInterest: 10,
      collateral: [
        {
          assetName: 'property',
          estimatedValues: 7000,
        },
      ],
    },
    {
      princicpal: 140000,
      periodInYears: '4',
      rateOfInterest: 12,
      isCommercial: true,
      collateral: [
        {
          assetName: 'condo',
          estimatedValues: 30000,
        },
      ],
    },
    {
      princicpal: 60000,
      periodInYears: '4',
      rateOfInterest: 12,
    },
  ],
  liquid_assets: 100000,
  non_liquid_assets: 300000,
};

const uploadMapping = async (file, version) => {
  const results = [];

  const targetJSON = {};
  let specJSONString = '{';
  console.log(JSON.stringify(sourceJSON));

  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => {
      let str = JSON.stringify(data);
      if (str.includes('ENUM')) {
        const x = {};
        let enumerate = '';
        for (let y in data) {
          if (y === 'No.' || y === 'Target') {
            x[y] = data[y];
            continue;
          } else {
            if (y === ' Source') {
              var i = data[y].indexOf(',');
              var source = data[y].slice(0, i);

              if (i === -1) {
                x[' Source'] = data[y];
              } else {
                x[' Source'] = source;
              }

              if (!(i === -1)) {
                enumerate += data[y].slice(i + 1) + ',';
              }
            } else {
              enumerate += data[y] + ',';
            }
          }
        }
        let st = {};
        if (enumerate.length !== 0) {
          let ap = enumerate.split(',');
          for (let k = 0; k < ap.length; k++) {
            var po = ap[k];
            let key = '';
            let val = '';
            let bool = 1;
            for (let m = 0; m < po.length; m++) {
              if (po[m] === '}') {
                break;
              }
              if (po[m] === '"' || po[m] === '{') {
                continue;
              } else {
                if (po[m] == ':') {
                  bool = 0;
                  continue;
                }
                if (bool === 1) {
                  key += po[m];
                } else {
                  val += po[m];
                }
              }
            }
            if (key === '') {
              continue;
            }
            st[key.trim()] = val.trim();
          }
        }
        x[' Enumeration'] = st;
        results.push(x);
      } else {
        results.push(data);
      }
    })
    .on('end', async () => {
      for (let i = 0; i < results.length; i++) {
        let final_value = '';
        let value = results[i][' Source'];
        if (!value.includes('(')) {
          value = value.trim();
          let a = value.split('+').map((v) => v.trim().replace('.', ''));

          let sourceObj;
          if (typeof sourceJSON[a[0]] == 'number') {
            sourceObj = NumberAddition(a);
          } else {
            sourceObj = StringConcat(a);
          }

          let ll = JSON.stringify(sourceObj);

          targetJSON[results[i].Target] = `${JSON.parse(ll)}`;

          specJSONString += `\'${results[i].Target}\'`;
          specJSONString += ':';
          specJSONString += JSON.parse(ll);
          if (i == results.length - 1) {
            break;
          }
          specJSONString += ',';

          // console.log(specJSONString);
        } else if (value.includes('ENUM')) {
          let enum_key;
          let enumeration;
          let enum_original_value;

          if (value.includes('+')) {
            let aop = value.split('+');
            //console.log(aop);
            let ek = {};
            for (let m = 0; m < aop.length; m++) {
              let z;
              if (aop[m].includes('ENUM')) {
                z = aop[m].trim().match('(?<=.|^)[^.]+$')[0].slice(0, -1);
                ek['ENUM'] = z;
              } else if (aop[m].includes('.')) {
                ek['ENUM2'] = aop[m].trim().slice(1);
              } else {
                ek['ENUM3'] = aop[m].trim().split('"')[1];
              }
            }
            enum_original_value = sourceJSON[ek['ENUM']];
            enumeration = results[i][' Enumeration'];
            //console.log(enumeration)
            final_value = enumeration[enum_original_value].toString() + ek['ENUM3'] + sourceJSON[ek['ENUM2']].toString();

            //console.log(enum_original_value,enumeration,final_value,sourceJSON[ek["ENUM2"]]);
          } else {
            enum_key = value.match('(?<=.|^)[^.]+$')[0].slice(0, -1);
            //console.log(enum_key);
            enum_original_value = sourceJSON[enum_key];
            //console.log(enum_original_value);
            enumeration = results[i][' Enumeration'];
          }

          //console.log();

          // let arr = enumeration.replaceAll(",\"",",");

          // enum_obj=JSON.parse(arr)

          specJSONString += `\'${results[i].Target}\'`;
          specJSONString += ':';
          if (!(final_value === '')) {
            specJSONString += `\"${final_value}\"`;
          } else {
            specJSONString += enumGenerator(enumeration, i, enum_key);
          }

          // console.log(enum_obj[enum_original_value]);
          if (i == results.length - 1) {
            break;
          }
          specJSONString += ',';
          // console.log(typeof());

          // let a = value.split("(")
        } else if (value.includes('IF')) {
          let target = results[i].Target;
          let nestedField = null;

          var targetsArray = results[i].Target.split('.');
          if (results[i].Target.includes('.')) {
            target = targetsArray[0];
            specJSONString += `\'${target}\'`;
            specJSONString += ':';
            nestedField = targetsArray[targetsArray.length - 1];
            specJSONString += IfElseResolver(value, true, nestedField);
          } else {
            specJSONString += `\'${target}\'`;
            specJSONString += ':';
            specJSONString += IfElseResolver(value, false, nestedField);
          }
          //console.log(value)

          //console.log(IfElseResolver(value,false,null))
          if (i == results.length - 1) {
            break;
          }
          specJSONString += ',';
        }
      }
      if (specJSONString[specJSONString.length - 1] == ',') {
        specJSONString = specJSONString.slice(0, -1);
      }
      specJSONString += '}';
    });

  const ver = await TransformVersions.findOne({ version: version });
  // console.log(version);
  if (ver) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Version ${version} already exists`);
  }
  return await TransformVersions.create({ specString: specJSONString, version: version });
};

module.exports = {
  uploadMapping,
};