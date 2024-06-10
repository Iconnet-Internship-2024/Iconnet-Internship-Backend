const express = require('express');
const router = express.Router();
const riwayatLogController = require('../controllers/riwayatLogController');

router.get('/', riwayatLogController.getAllRiwayatLog);

module.exports = router;
