const express = require("express");
const router = express.Router();
const authRoute = require('./authRoutes')
const userRoute = require('./userRoutes')
const adminRoute = require('./adminRoutes')
const dataDiriRoute = require('./dataDiriRoutes')
const pengajuanRoute = require('./pengajuanRoutes')
const riwayatLogRoute = require('./riwayatLogRoutes')

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/admin', adminRoute);
router.use('/data-diri', dataDiriRoute);
router.use('/pengajuan', pengajuanRoute);
router.use('/riwayat-log', riwayatLogRoute);

module.exports = router;