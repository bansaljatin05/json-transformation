const jsonata = require('jsonata');
const { TransformVersions } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');
const { NumberAddition, StringConcat, shift } = require('../utils/TransformUtils');

const uploadMapping = async (file) => {
  const results = [];

  const sourceJSON = {
    id: '122-34-6543',
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
  };

  const targetJSON = {};
  let specJSONString = '{';

  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      for (let i = 0; i < results.length; i++) {
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
          let enum_key = value.match('(?<=.|^)[^.]+$')[0].slice(0, -1);

          let enum_original_value = sourceJSON[enum_key];

          let enumeration = results[i][' Enumeration'];

          let arr = enumeration.replaceAll(',"', ',');

          enum_obj = JSON.parse(arr);

          specJSONString += `\'${results[i].Target}\'`;
          specJSONString += ':';
          specJSONString += `\"${enum_obj[enum_original_value]}\"`;

          // console.log(enum_obj[enum_original_value]);
          if (i == results.length - 1) {
            break;
          }
          specJSONString += ',';
          // console.log(typeof());

          // let a = value.split("(")
        }
      }
      if (specJSONString[specJSONString.length - 1] == ',') {
        specJSONString = specJSONString.slice(0, -1);
      }
      specJSONString += '}';
      console.log(specJSONString);

      TransformVersions.create({ specString: specJSONString, version: 'v1' });
      // return specJSONString;

      // console.log(specJSONString);

      // var expression = jsonata(specJSONString);
      // var result = expression.evaluate(sourceJSON);
      // console.log(result);
    });
};

module.exports = {
  uploadMapping,
};
