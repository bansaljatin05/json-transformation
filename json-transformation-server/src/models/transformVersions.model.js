const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transformVersionsSchema = mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  specString: {
    type: String,
    required: true,
    trim: true,
  },
});

transformVersionsSchema.plugin(toJSON);

const TransformVersions = mongoose.model('TransformVersions', transformVersionsSchema);

module.exports = TransformVersions;
