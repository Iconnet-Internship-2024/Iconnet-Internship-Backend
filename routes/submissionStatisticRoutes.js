const express = require("express");
const router = express.Router();
const submissionStatisticController = require("../controllers/submissionStatisticController");

router.get("/", submissionStatisticController.getTotalSubmissions);
router.get("/pending", submissionStatisticController.getTotalPendingSubmissions);
router.get("/inProcess", submissionStatisticController.getTotalInProcessSubmissions);
router.get("/accepted", submissionStatisticController.getTotalAcceptedSubmissions);
router.get("/rejected", submissionStatisticController.getTotalRejectedSubmissions);

module.exports = router;
