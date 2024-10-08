const express = require("express");
const router = express.Router();
const jobDivisionController = require("../controllers/jobDivisionController");

router.get("/:id", jobDivisionController.getJobDivisionById);
router.get("/", jobDivisionController.getAllJobDivisions);

router.post("/", jobDivisionController.addJobDivision);

router.put("/:id", jobDivisionController.updateJobDivision);

router.delete("/:id", jobDivisionController.deleteJobDivision);

module.exports = router;
