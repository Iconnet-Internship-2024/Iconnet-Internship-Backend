const { admin } = require("../models");

module.exports = {
  getAllAdmin: async (req, res) => {
    try {
      const result = await admin.findAll();
      res.status(200).json({
        message: "Get All Data Admin",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin" });
    }
  },
};
