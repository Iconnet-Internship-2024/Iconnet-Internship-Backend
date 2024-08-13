const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { sendEmailUpdatePass } = require("../utils/sendEmail");

module.exports = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
      res.status(200).json({
        message: "Get All Users",
        data: users,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findOne({
        where: { id: userId },
        include: [
          {
            model: pengajuan,
            attributes: ["status"],
          },
        ],
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });

      if (!user || user.length === 0) {
        return res.status(404).json({
          message: "No users found",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updateUsername: async (req, res) => {
    try {
      const { newUsername } = req.body;
      const userId = req.user.userId;

      const user = await User.findOne({
        where: { id: userId, username: newUsername },
      });

      if (!user || user.length === 0) {
        return res.status(404).json({
          message: "No users found",
        });
      }

      const updatedUsername = await User.update(
        { username: newUsername },
        { where: { id: userId } }
      );

      if (updatedUsername[0] > 0) {
        return res.status(200).json({
          message: "Successfully updated username",
        });
      } else {
        return res.status(400).json({
          message: "Failed to update username",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmNewPass } = req.body;

      if (!oldPassword || !newPassword || !confirmNewPass) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const userId = req.user.userId;
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      const currentTime = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (
        user.last_password_change &&
        currentTime - new Date(user.last_password_change) < oneWeek
      ) {
        return res
          .status(403)
          .send({ message: "You can only reset or change your password once a week" });
      }

      const validPass = await bcrypt.compare(oldPassword, user.password);
      if (!validPass) {
        return res.status(401).json({
          status: "failed",
          message: "Wrong old password",
        });
      }

      if (newPassword === oldPassword) {
        return res.status(400).json({
          status: "failed",
          message:
            "New password must be different from the current password. Try a different password.",
        });
      }

      if (newPassword !== confirmNewPass) {
        return res.status(400).json({
          status: "failed",
          message: "New password and confirmation do not match",
        });
      }

      const passwordRegex = /^.{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(403).json({
          message: "Password must be at least 8 characters long",
        });
      }

      const salt = await bcrypt.genSalt();
      const newHashPass = await bcrypt.hash(newPassword, salt);

      const updatePass = await User.update(
        { password: newHashPass, last_password_change: new Date() },
        { where: { id: user.id } }
      );

      const email = user.email;
      const username = user.username;
      if (updatePass[0] === 1) {
        const emailSend = await sendEmailUpdatePass(email, username);

        if (!emailSend.success) {
          return res.status(500).json({
            message: "Password updated successful, but email not sent.",
          });
        }

        return res.status(200).json({
          message: "Password updated successful and email sent.",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
