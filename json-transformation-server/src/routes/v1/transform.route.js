const express = require('express');
const router = express.Router();
const transformController = require('../../controllers/transform.controller');

router.post('/', transformController.transformJson);

module.exports = router;
