var jsonata = require('jsonata');
const { TransformVersions } = require('../models');

const transformJson = async (reqBody) => {
  const transformedVersion = await TransformVersions.findOne({ version: reqBody.version });

  var expression = jsonata(transformedVersion.specString);
  var result = expression.evaluate(reqBody.srcJson);

  return result;
};

module.exports = {
  transformJson,
};

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
  occupation: 'salaried',
  age: 29,
};
