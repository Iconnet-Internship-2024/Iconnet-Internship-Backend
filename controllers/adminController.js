const { admin } = require("../models");

module.exports = {
  getAllAdminProfiles: async (req, res) => {
    try {
      const admins = await admin.findAll();
      res.status(200).json({
        message: "Get All Admin Profiles",
        data: admins,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getAdminProfileById: async (req, res) => {
    try {
      const { id } = req.params;

      const adminData = await admin.findByPk(id);

      if (!adminData) {
        return res.status(404).json({
          status: "failed",
          message: "Admin profile not found",
        });
      }

      res.status(200).json({
        status: "Successfully get admin profile",
        data: adminData,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getAdminProfileByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;

      const existingAdmin = await admin.findOne({
        where: { user_id: user_id },
      });

      if (!existingAdmin) {
        return res.status(404).json({
          status: "failed",
          message: "Admin profile not found",
        });
      }

      res.status(200).json({
        message: `Successfully get admin with user ID ${user_id}`,
        data: existingAdmin,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  createAdminProfile: async (req, res) => {
    try {
      const { userId } = req.user;

      const existingAdmin = await admin.findOne({
        where: { user_id: userId },
      });

      if (existingAdmin) {
        return res.status(404).json({
          status: "failed",
          message: "Admin profile already exist",
        });
      }

      const newAdminProfile = await admin.create({
        user_id: userId,
      });

      res.status(201).json({
        message: "Successfully created admin profile",
        data: newAdminProfile,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updateAdminProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, phone_number, job_position } = req.body;

      const existingAdmin = await admin.findByPk(id);

      if (!existingAdmin) {
        return res.status(404).json({
          status: "failed",
          message: "Admin profile not found",
        });
      }

      const [updated] = await admin.update(
        {
          name: name || existingAdmin.name,
          phone_number: phone_number || existingAdmin.phone_number,
          job_position: job_position || existingAdmin.job_position,
        },
        { where: { id } }
      );

      console.log(updated);

      if (updated === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No changes made to the admin profile",
        });
      } else {
        const updatedAdmin = await admin.findByPk(id);
        return res.status(200).json({
          message: "Successfully updated admin profile",
          data: updatedAdmin,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteAdminProfile: async (req, res) => {
    try {
      const { id } = req.params;

      const existingAdmin = await admin.findByPk(id);

      if (!existingAdmin) {
        return res.status(404).json({
          status: "failed",
          message: "Admin profile not found",
        });
      }

      const deleted = await admin.destroy({ where: { id } });

      if (deleted) {
        res.status(200).json({
          message: "Successfully deleted admin profile",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
