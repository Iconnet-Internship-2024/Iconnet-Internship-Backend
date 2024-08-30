const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");
const upload = require("../middleware/multer");
const { authorize } = require("../middleware/authMiddleware");

router.get("/user/:user_id", applicantController.getApplicantByUserId);
router.get("/:id", applicantController.getApplicantById);
router.get("/", authorize([3]), applicantController.getAllApplicants);

router.post(
  "/local",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "education_transcript", maxCount: 1 },
  ]),
  applicantController.addApplicantLocal
);
router.post(
  "/imagekit",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "education_transcript", maxCount: 1 },
  ]),
  applicantController.addApplicantImageKit
);
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "education_transcript", maxCount: 1 },
  ]),
  applicantController.addApplicant
);

router.put(
  "/updatePhotoLocal",
  upload.single("photo"),
  applicantController.updatePhotoLocal
);
router.put(
  "/updatePhoto",
  upload.single("photo"),
  applicantController.updatePhoto
);

router.delete("/local/:id", applicantController.deleteApplicantLocal);
router.delete("/:id", applicantController.deleteApplicant);

module.exports = router;
