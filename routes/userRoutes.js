const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get('/', userController.getAllUsers);
router.put('/updatePassword', authenticate, userController.updatePassword)

module.exports = router;
