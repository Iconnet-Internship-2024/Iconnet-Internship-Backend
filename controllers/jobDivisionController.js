const { job_division } = require("../models");

module.exports = {
  getAllJobDivisions: async (req, res) => {
    try {
      const jobDivisions = await job_division.findAll();
      res.status(200).json({
        message: "Get All Job Divisions",
        data: jobDivisions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getJobDivisionById: async (req, res) => {
    try {
      const { id } = req.params;

      const jobDivisionData = await job_division.findByPk(id);

      if (!jobDivisionData) {
        return res.status(404).json({
          status: "failed",
          message: "Job Division not found",
        });
      }

      res.status(200).json({
        status: "Successfully get job division data",
        data: jobDivisionData,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addJobDivision: async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name || !description) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const newJobDivision = await job_division.create({
        name: name,
        description: description,
      });

      res.status(200).json({
        message: "Successfully added job division",
        data: newJobDivision,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updateJobDivision: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const existingJobDivision = await job_division.findByPk(id);

      if (!existingJobDivision) {
        return res.status(404).json({
          status: "failed",
          message: "Job division not found",
        });
      }

      const [updated] = await job_division.update(
        {
          name: name || existingJobDivision.name,
          description: description || existingJobDivision.description,
        },
        { where: { id: id } }
      );

      if (updated === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No changes made to job division",
        });
      } else {
        const updatedJobDivision = await job_division.findByPk(id);
        res.status(200).json({
          message: "Successfully updated job division",
          data: updatedJobDivision,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteJobDivision: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const existingJobDivision = await job_division.findByPk(id);

      if (!existingJobDivision) {
        return res.status(404).json({
          status: "failed",
          message: "Job division not found",
        });
      }

      await job_division.destroy({ where: { id: id } });

      res.status(200).json({
        message: "Successfully deleted job division",
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
