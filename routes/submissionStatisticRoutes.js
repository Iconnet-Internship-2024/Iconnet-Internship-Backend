const express = require("express");
const router = express.Router();
const submissionStatisticController = require("../controllers/submissionStatisticController");

router.get("/pending", submissionStatisticController.getTotalPendingSubmissions);
router.get("/inProcess", submissionStatisticController.getTotalInProcessSubmissions);
router.get("/accepted", submissionStatisticController.getTotalAcceptedSubmissions);
router.get("/rejected", submissionStatisticController.getTotalRejectedSubmissions);
router.get("/", submissionStatisticController.getTotalSubmissions);

module.exports = router;
