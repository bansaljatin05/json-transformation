const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { uploadMappingService } = require('../services');
const ApiError = require('../utils/ApiError');

const uploadMapping = catchAsync(async (req, res) => {
  const response = await uploadMappingService.uploadMapping(req.file.path);
  if (!response) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This version already exists');
  }
  res.send(`File uploaded successfully and can be used with for JSON transformation}`);
});

module.exports = {
  uploadMapping,
};
