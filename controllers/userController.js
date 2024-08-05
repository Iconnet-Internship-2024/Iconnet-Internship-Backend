const { User, pengajuan } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        message: "Success get all users",
        data: users,
      });
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const password = req.body.password;
      const newPassword = req.body.newPassword;

      if (!password || !newPassword) {
        return res.status(400).send({
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

      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(401).json({
          status: "failed",
          message: "Wrong password",
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
        { password: newHashPass },
        { where: { id: user.id } }
      );
      if (updatePass) {
        return res.status(200).send({ message: "Password updated" });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
