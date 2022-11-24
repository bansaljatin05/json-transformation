const jsonata = require('jsonata');
const { TransformVersions } = require('../models');
const csv = require('csv-parser');
const fs = require('fs');

const uploadMapping = async (file) => {
  const results = [];

  fs.createReadStream(file)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(results);
    });
};

module.exports = {
  uploadMapping,
};
