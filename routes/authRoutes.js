const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login)
router.post('/register', authController.register)
router.delete('/logout', authController.logout)
router.post('/forgotPassword', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;