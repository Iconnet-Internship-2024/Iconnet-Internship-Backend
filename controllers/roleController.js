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
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getRoleById: async (req, res) => {
    try {
      const { id } = req.params;

      const roleData = await role.findByPk(id);

      if (!roleData) {
        return res.status(404).json({
          status: "failed",
          message: "Role not found",
        });
      }

      res.status(200).json({
        status: "Successfully get role data",
        data: roleData,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addRole: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const newRole = await role.create({ name: name });

      res.status(200).json({
        message: "Successfully added role",
        data: newRole,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updateRole: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const existingRole = await role.findByPk(id);

      if (!existingRole) {
        return res.status(404).json({
          status: "failed",
          message: "Role not found",
        });
      }

      const [updated] = await role.update(
        {
          name: name || existingRole.name,
        },
        { where: { id: id } }
      );

      if (updated === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No changes made to role",
        });
      } else {
        const updatedRole = await role.findByPk(id);
        res.status(200).json({
          message: "Successfully updated role",
          data: updatedRole,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteRole: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const existingRole = await role.findByPk(id);

      if (!existingRole) {
        return res.status(404).json({
          status: "failed",
          message: "Role not found",
        });
      }

      await role.destroy({ where: { id: id } });

      res.status(200).json({
        message: "Successfully deleted role",
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
