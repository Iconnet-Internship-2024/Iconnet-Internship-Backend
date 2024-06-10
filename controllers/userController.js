const { User, pengajuan } = require("../models");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        include: [
          {
            model: pengajuan,
            attributes: ["status"],
          },
        ],
      });
      res.status(200).json({
        message: "Get All Data Pengajuan",
        data: users,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },
};
