const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get('/', roleController.getAllRoles);

module.exports = router;
