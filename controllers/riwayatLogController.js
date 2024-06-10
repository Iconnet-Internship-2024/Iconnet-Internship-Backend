const { riwayat_log } = require("../models");

module.exports = {
  getAllRiwayatLog: async (req, res) => {
    try {
      const result = await riwayat_log.findAll();
      res.status(200).json({
        message: "Get All Data Riwayat Log",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch riwayat log" });
    }
  },
};
