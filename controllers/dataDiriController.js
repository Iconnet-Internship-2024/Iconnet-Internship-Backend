const { data_diri } = require("../models");

module.exports = {
  getAllDataDiri: async (req, res) => {
    try {
      const result = await data_diri.findAll();
      res.status(200).json({
        message: "Get All Data Diri",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data diri" });
    }
  },
};
