const express = require("express");
const router = express.Router();
const pengajuanController = require("../controllers/pengajuanController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, pengajuanController.getAllPengajuan);
// router.get('/', pengajuanController.getAllPengajuan);

module.exports = router;
