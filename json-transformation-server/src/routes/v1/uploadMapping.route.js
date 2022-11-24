const express = require('express');
const router = express.Router();
const uploadMappingController = require('../../controllers/uploadMapping.controller');
const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../upload'));
  },

  filename: function (req, file, cb) {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), uploadMappingController.uploadMapping);

module.exports = router;
