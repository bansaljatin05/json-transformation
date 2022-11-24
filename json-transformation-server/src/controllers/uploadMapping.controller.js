const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { uploadMappingService } = require('../services');

const uploadMapping = catchAsync(async (req, res) => {
  await uploadMappingService.uploadMapping(req.file.path);
  res.send(`File uploaded successfully and can be used with for JSON transformation}`);
});

module.exports = {
  uploadMapping,
};
