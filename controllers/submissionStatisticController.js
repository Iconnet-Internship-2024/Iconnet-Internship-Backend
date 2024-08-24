const { submission, User, program } = require("../models");
const { Op, Sequelize } = require("sequelize");

module.exports = {
  getTotalSubmissions: async (req, res) => {
    try {
      const totalSubmissions = await submission.count();

      res.status(200).json({
        message: "Total Submissions",
        total: totalSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalPendingSubmissions: async (req, res) => {
    try {
      const totalPendingSubmissions = await submission.count({
        where: { status: "pending" },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total Pending Submissions",
        total: totalPendingSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalInProcessSubmissions: async (req, res) => {
    try {
      const totalInProcessSubmissions = await submission.count({
        where: { status: "in_process" },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total In Process Submissions",
        total: totalInProcessSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalAcceptedSubmissions: async (req, res) => {
    try {
      const totalAcceptedSubmissions = await submission.count({
        where: { status: "accepted" },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total Accepted Submissions",
        total: totalAcceptedSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalRejectedSubmissions: async (req, res) => {
    try {
      const totalRejectedSubmissions = await submission.count({
        where: { status: "rejected" },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total Rejected Submissions",
        total: totalRejectedSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getSubmissionStatisticsByRoleAndMonth: async (req, res) => {
    try {
      // Mengambil tahun dari query parameter, jika tidak ada gunakan tahun sekarang
      const { year } = req.query;
      const selectedYear = year || new Date().getFullYear();

      const statistics = await submission.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
          [Sequelize.fn("COUNT", Sequelize.col("submission.id")), "total"],
          [Sequelize.literal(`role_id`), "role_id"],
        ],
        include: [
          {
            model: User,
            where: { role_id: [1, 2] },
            attributes: ["role_id"],
          },
        ],
        where: {
          createdAt: {
            [Op.between]: [
              new Date(`${selectedYear}-01-01`),
              new Date(`${selectedYear}-12-31`),
            ],
          },
        },
        group: [
          Sequelize.literal("role_id"),
          Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        ],
        order: [[Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"]],
      });

      res.status(200).json({
        message: `Submission statistics for role_id 1 and 2 in year ${selectedYear}`,
        data: statistics,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalSubmissionsByRole: async (req, res) => {
    try {
      const totalSubmissions = await submission.count({
        include: [
          {
            model: User,
            where: { role_id: [1, 2] },
            attributes: [],
          },
        ],
      });

      res.status(200).json({
        message: "Total Submissions by Role",
        total: totalSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalPendingSubmissionsByRole: async (req, res) => {
    try {
      const totalPendingSubmissions = await submission.count({
        where: { status: "pending" },
        include: [
          {
            model: User,
            where: { role_id: [1, 2] },
            attributes: [],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total Pending Submissions by Role",
        total: totalPendingSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalInProcessSubmissionsByRole: async (req, res) => {
    try {
      const totalInProcessSubmissions = await submission.count({
        where: { status: "in_process" },
        include: [
          {
            model: User,
            where: { role_id: [1, 2] },
            attributes: [],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total In Process Submissions by Role",
        total: totalInProcessSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalAcceptedSubmissionsByRole: async (req, res) => {
    try {
      const totalAcceptedSubmissions = await submission.count({
        where: { status: "accepted" },
        include: [
          {
            model: User,
            where: { role_id: [1, 2] },
            attributes: [],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total Accepted Submissions by Role",
        total: totalAcceptedSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalRejectedSubmissionsByRole: async (req, res) => {
    try {
      const totalRejectedSubmissions = await submission.count({
        where: { status: "rejected" },
        include: [
          {
            model: User,
            where: { role_id: [1, 2] },
            attributes: [],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Total Rejected Submissions by Role",
        total: totalRejectedSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  filterSubmissionsByStatus: async (req, res) => {
    const { status } = req.query;
    try {
      const submissions = await submission.findAll({
        where: { status },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: `Filtered Submissions by Status: ${status}`,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  // Filter submission by program
  filterSubmissionsByProgram: async (req, res) => {
    const { program_id } = req.query;
    try {
      const submissions = await submission.findAll({
        where: { program_id },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: `Filtered Submissions by Program ID: ${program_id}`,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  // Search submission by username
  searchSubmissionsByUsername: async (req, res) => {
    const { username } = req.query;
    try {
      const submissions = await submission.findAll({
        include: [
          {
            model: User,
            where: { username: { [Op.like]: `%${username}%` } },
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: `Search Submissions by Username: ${username}`,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  // Search submission by user ID
  searchSubmissionsByUserId: async (req, res) => {
    const { user_id } = req.query;
    try {
      const submissions = await submission.findAll({
        where: { user_id },
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: `Search Submissions by User ID: ${user_id}`,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  // Sort submissions by oldest (ascending order of createdAt)
  sortSubmissionsOldest: async (req, res) => {
    try {
      const submissions = await submission.findAll({
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "ASC"]], // Sort by oldest first
      });

      res.status(200).json({
        message: "Submissions sorted by oldest first",
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  // Sort submissions by newest (descending order of createdAt)
  sortSubmissionsNewest: async (req, res) => {
    try {
      const submissions = await submission.findAll({
        include: [
          {
            model: User,
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]], // Sort by newest first
      });

      res.status(200).json({
        message: "Submissions sorted by newest first",
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },
};
