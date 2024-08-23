const express = require("express");
const router = express.Router();
const authRoute = require("./authRoutes");
const userRoute = require("./userRoutes");
const roleRoute = require("./roleRoutes");
const applicantRoute = require("./applicantRoutes");
const adminRoute = require("./adminRoutes");
const jobDivisionRoute = require("./job_divisionRoutes");
const programRoute = require("./programRoutes");
const submissionRoute = require("./submissionRoutes");
const submissionStatisticRoute = require("./submissionStatisticRoutes");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use("/auth", authRoute);
router.use("/user", authenticate, userRoute);
router.use("/role", authenticate, roleRoute);
router.use("/applicant", authenticate, applicantRoute);
// router.use("/applicant", applicantRoute);
router.use("/admin", authenticate, authorize([3]), adminRoute);
router.use("/jobDivision", authenticate, authorize([3]), jobDivisionRoute);
router.use("/program", authenticate, authorize([3]), programRoute);
router.use("/submission", authenticate, submissionRoute);
router.use("/submissionStatistic", authenticate, submissionStatisticRoute);

module.exports = router;
