const { applicant } = require("../models");

module.exports = {
  getAllApplicants: async (req, res) => {
    try {
      const applicants = await applicant.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json({
        message: "Get All Applicants",
        data: applicants,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applicants" });
    }
  },
};
