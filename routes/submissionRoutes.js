const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const upload = require("../middleware/multer");
const { authorize } = require("../middleware/authMiddleware");

router.get("/status", submissionController.getSubmissionStatusByUserId);
router.get("/deletedSubmission", submissionController.getAllDeletedSubmissions);
router.get("/user/:user_id", submissionController.getSubmissionByUserId);
router.get("/:id", submissionController.getSubmissionById);
router.get("/", authorize([3]), submissionController.getAllSubmissions);

router.post(
  "/add/im",
  upload.fields([
    { name: "cover_letter", maxCount: 1 },
    { name: "proposal", maxCount: 1 },
  ]),
  submissionController.addSubmissionIm
);
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
  authorize([3]),
  submissionController.updateSubmissionStatus
);

router.delete(
  "/hardDelete/im/:id",
  authorize([3]),
  submissionController.hardDeleteSubmissionIm
);
router.delete(
  "/softDelete/:id",
  authorize([3]),
  submissionController.softDeleteSubmission
);
router.delete(
  "/hardDelete/:id",
  authorize([3]),
  submissionController.hardDeleteSubmission
);

module.exports = router;
