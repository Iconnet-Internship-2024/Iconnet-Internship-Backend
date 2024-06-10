const { pengajuan, User } = require("../models");

module.exports = {
  getAllPengajuan: async (req, res) => {
    try {
      const result = await pengajuan.findAll({
        include: [
          {
            model: User,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
      });
      res.status(200).json({
        message: "Get All Data Pengajuan",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch pengajuan" });
    }
  },
};
