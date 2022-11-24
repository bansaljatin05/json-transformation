const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { uploadMappingService } = require('../services');

const uploadMapping = catchAsync(async (req, res) => {
  const versionInfo = await uploadMappingService.uploadMapping(req.file.path);
  res.send(`File uploaded successfully with version ${versionInfo}`);
});

module.exports = {
  uploadMapping,
};
