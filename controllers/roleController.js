const { role } = require("../models");

module.exports = {
  getAllRoles: async (req, res) => {
    try {
      const roles = await role.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      res.status(200).json({
        message: "Get All Roles",
        data: roles,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch roles" });
    }
  },
};
