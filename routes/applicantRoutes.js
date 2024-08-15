const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");
const upload = require("../middleware/multer");

router.get("/", applicantController.getAllApplicants);
router.get("/:id", applicantController.getApplicantById);
router.get("/user/:user_id", applicantController.getApplicantByUserId);
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "education_transcript", maxCount: 1 },
  ]),
  applicantController.addApplicant
);
router.put('/updatePhoto', upload.single('photo'), applicantController.updatePhoto);
router.delete('/:id', applicantController.deleteApplicant);

module.exports = router;
