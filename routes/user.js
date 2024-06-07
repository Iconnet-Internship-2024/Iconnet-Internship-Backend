// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/user');

// Route to get all users
router.get('/', userController.getAllUsers);

module.exports = router;
