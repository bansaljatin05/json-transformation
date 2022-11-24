var jsonata = require('jsonata');
const { TransformVersions } = require('../models');

const transformJson = async (reqBody) => {
  const version = reqBody.version;

  const transformVerison = TransformVersions.findOne(version);
};

module.exports = {
  transformJson,
};
