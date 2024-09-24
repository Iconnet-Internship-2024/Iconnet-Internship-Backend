const { submission, User, program } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getTotalSubmissionsByStatus: async (req, res) => {
    try {
      const getTotalSubmissions = await submission.count();
      const totalPendingSubmissions = await submission.count({
        where: { status: "pending" },
      });
      const totalInProcessSubmissions = await submission.count({
        where: { status: "in_process" },
      });
      const totalAcceptedSubmissions = await submission.count({
        where: { status: "accepted" },
      });
      const totalRejectedSubmissions = await submission.count({
        where: { status: "rejected" },
      });

      res.status(200).json({
        message: "Total Submissions and Status Breakdown",
        totalSubmissions: getTotalSubmissions,
        totalByStatus: {
          pending: totalPendingSubmissions,
          in_process: totalInProcessSubmissions,
          accepted: totalAcceptedSubmissions,
          rejected: totalRejectedSubmissions,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  getTotalSubmissionsByStatusAndRole: async (req, res) => {
    try {
      const { role_id } = req.query;

      if (!role_id) {
        return res.status(400).json({
          message: "role_id parameter is required",
        });
      }

      const getTotalSubmissions = await submission.count({
        include: [
          {
            model: User,
            where: { role_id: role_id },
          },
        ],
      });

      const totalPendingSubmissions = await submission.count({
        include: [
          {
            model: User,
            where: { role_id: role_id },
          },
        ],
        where: { status: "pending" },
      });

      const totalInProcessSubmissions = await submission.count({
        include: [
          {
            model: User,
            where: { role_id: role_id },
          },
        ],
        where: { status: "in_process" },
      });

      const totalAcceptedSubmissions = await submission.count({
        include: [
          {
            model: User,
            where: { role_id: role_id },
          },
        ],
        where: { status: "accepted" },
      });

      const totalRejectedSubmissions = await submission.count({
        include: [
          {
            model: User,
            where: { role_id: role_id },
          },
        ],
        where: { status: "rejected" },
      });

      res.status(200).json({
        message: `Total Submissions and Status Breakdown for Role ${role_id}`,
        totalSubmissions: getTotalSubmissions,
        totalByStatus: {
          pending: totalPendingSubmissions,
          in_process: totalInProcessSubmissions,
          accepted: totalAcceptedSubmissions,
          rejected: totalRejectedSubmissions,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  filterSubmission: async (req, res) => {
    try {
      const { month, year, status, program_id, role_id } = req.query;
      const selectedYear = year || new Date().getFullYear(); // Gunakan tahun saat ini jika tidak disertakan

      // Validasi input bulan jika disertakan
      if (month && (isNaN(month) || month < 1 || month > 12)) {
        return res
          .status(400)
          .json({
            message:
              "Invalid month parameter. It must be a number between 1 and 12.",
          });
      }

      let dateFilter = {};
      if (month) {
        // Jika bulan disertakan, tentukan rentang tanggal untuk bulan yang dipilih
        const startDate = new Date(
          `${selectedYear}-${month.padStart(2, "0")}-01`
        );
        const endDate = new Date(selectedYear, month, 0); // Hari terakhir dari bulan yang dipilih
        dateFilter = {
          createdAt: {
            [Op.between]: [startDate, endDate],
          },
        };
      } else {
        // Jika bulan tidak disertakan, ambil semua submissions untuk tahun yang dipilih
        dateFilter = {
          createdAt: {
            [Op.between]: [
              new Date(`${selectedYear}-01-01`),
              new Date(`${selectedYear}-12-31`),
            ],
          },
        };
      }

      const whereConditions = {
        ...dateFilter,
        ...(status ? { status } : {}),
        ...(program_id ? { program_id } : {}),
      };

      const submissions = await submission.findAll({
        where: whereConditions,
        include: [
          {
            model: User,
            ...(role_id ? { where: { role_id } } : {}),
            attributes: ["username", "role_id"],
          },
          {
            model: program,
            attributes: ["id", "name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      let message = `Filtered Submissions`;
      if (month) message += ` for month ${month}`;
      if (status) message += ` with status ${status}`;
      if (program_id) message += ` for program ID ${program_id}`;
      if (role_id) message += ` with role ID ${role_id}`;
      message += ` of year ${selectedYear}`;

      res.status(200).json({
        message,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  searchSubmission: async (req, res) => {
    try {
      const { username, user_id } = req.query;
      const whereConditions = {};

      if (username) {
        whereConditions.username = { [Op.like]: `%${username}%` };
      }

      if (user_id) {
        whereConditions.user_id = user_id;
      }

      // If neither username nor user_id is provided, return an error
      // if (!username && !user_id) {
      //   return res.status(400).json({ message: "At least one of username or user_id must be provided." });
      // }

      const submissions = await submission.findAll({
        where: user_id ? { user_id } : {}, // Apply user_id filter if provided
        include: [
          {
            model: User,
            ...(username
              ? { where: { username: { [Op.like]: `%${username}%` } } }
              : {}), // Apply username filter if provided
            attributes: ["username"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      let message = "Search Submissions";
      if (username) message += ` by Username: ${username}`;
      if (user_id) message += ` by User ID: ${user_id}`;

      res.status(200).json({
        message,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },

  sortSubmissions: async (req, res) => {
    try {
      const { sort } = req.query;

      let order = [["createdAt", "DESC"]]; // Default sort: newest first

      if (sort === "oldest") {
        order = [["createdAt", "ASC"]]; // Sort oldest first
      } else if (sort === "newest") {
        order = [["createdAt", "DESC"]]; // Sort newest first
      }

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
        order,
      });

      const message =
        sort === "oldest"
          ? "Submissions sorted by oldest first"
          : "Submissions sorted by newest first";

      res.status(200).json({
        message,
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error: ${error.message}`,
      });
    }
  },
};
