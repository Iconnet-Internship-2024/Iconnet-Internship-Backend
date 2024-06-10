const express = require('express');
const router = express.Router();
const pengajuanController = require('../controllers/pengajuanController');

router.get('/', pengajuanController.getAllPengajuan);

module.exports = router;
