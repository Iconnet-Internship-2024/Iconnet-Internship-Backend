const express = require("express");
const router = express.Router();
const authRoute = require('./authRoutes')
const userRoute = require('./userRoutes')
const roleRoute = require('./roleRoutes')
const applicantRoute = require('./applicantRoutes')
const adminRoute = require('./adminRoutes')
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use('/auth', authRoute);
router.use('/user', authenticate, userRoute);
router.use('/role', roleRoute);
router.use('/applicant', authenticate, applicantRoute);
router.use('/admin', authenticate, authorize([3]), adminRoute)

module.exports = router;