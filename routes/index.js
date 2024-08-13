const express = require("express");
const router = express.Router();
const authRoute = require('./authRoutes')
const userRoute = require('./userRoutes')
const roleRoute = require('./roleRoutes')

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/role', roleRoute);

module.exports = router;