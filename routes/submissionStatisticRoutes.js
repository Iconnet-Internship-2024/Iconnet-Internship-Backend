const express = require("express");
const router = express.Router();
const submissionStatisticController = require("../controllers/submissionStatisticController");

router.get("/totalByStatus", submissionStatisticController.getTotalSubmissionsByStatus);
router.get("/totalByStatusAndRole", submissionStatisticController.getTotalSubmissionsByStatusAndRole);
router.get("/filter", submissionStatisticController.filterSubmission);
router.get("/search", submissionStatisticController.searchSubmission);
router.get("/sort", submissionStatisticController.sortSubmissions);

module.exports = router;
