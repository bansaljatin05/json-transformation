const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const { uploadMappingService } = require('../services');
const ApiError = require('../utils/ApiError');

const uploadMapping = catchAsync(async (req, res) => {
  try {
    const response = await uploadMappingService.uploadMapping(req.file.path, req.body.version);
    res.send(`File uploaded successfully and can be used with for JSON transformation`);
  } catch (error) {
    res.send(error.statusCode, `${error.message}`);
  }
});

module.exports = {
  uploadMapping,
};
