const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const upload = require("../middleware/multer");

router.get("/status", submissionController.getSubmissionStatusByUserId);
router.get("/deletedSubmission", submissionController.getAllDeletedSubmissions);
router.get("/:id", submissionController.getSubmissionById);
router.get("/", submissionController.getAllSubmissions);

router.post(
  "/",
  upload.fields([
    { name: "cover_letter", maxCount: 1 },
    { name: "proposal", maxCount: 1 },
  ]),
  submissionController.addSubmission
);
router.put(
  "/updateSubmissionStatus/:id",
  submissionController.updateSubmissionStatus
);
router.delete("/softDelete/:id", submissionController.softDeleteSubmission);
router.delete("/hardDelete/:id", submissionController.hardDeleteSubmission);

module.exports = router;
