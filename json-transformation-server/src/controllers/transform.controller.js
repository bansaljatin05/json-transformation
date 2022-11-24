const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { transformService } = require('../services');

const transformJson = catchAsync(async (req, res) => {
  const transformedJson = await transformService.transformJson(req.body);

  res.send(transformedJson);
});

module.exports = {
  transformJson,
};
