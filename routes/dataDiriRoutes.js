const express = require('express');
const router = express.Router();
const dataDiriController = require('../controllers/dataDiriController');

router.get('/', dataDiriController.getAllDataDiri);

module.exports = router;
