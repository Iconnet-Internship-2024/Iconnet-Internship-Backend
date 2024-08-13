const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User, reset_token } = require("../models");
const {
  sendEmailRegister,
  sendEmailReqResetPass,
  sendEmailResetPass,
} = require("../utils/sendEmail");

module.exports = {
  register: async (req, res) => {
    try {
      const { role_id, username, email, password, confirmPass } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const passwordRegex = /^.{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long",
        });
      }

      if (password !== confirmPass) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username: username }, { email: email }],
        },
      });

      if (existingUser) {
        let message = "";
        if (existingUser.username === username) {
          message += `Username ${existingUser.username} is already registered. `;
        }
        if (existingUser.email === email) {
          message += `Email ${existingUser.email} is already registered. `;
        }

        return res.status(400).json({
          message: message.trim() + " Please use a different one.",
        });
      }

      const salt = await bcrypt.genSalt();
      const hashPass = await bcrypt.hash(password, salt);

      const registerAcc = await User.create({
        username: username,
        email: email,
        password: hashPass,
        role_id: role_id,
      });

      if (registerAcc) {
        const emailSend = await sendEmailRegister(email, username);

        if (!emailSend.success) {
          return res
            .status(500)
            .json({ message: "User registered, but failed to send email." });
        }

        return res
          .status(200)
          .json({ message: "User registered successfully and email sent." });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { identifier, password } = req.body;

      const user = await User.findOne({
        where: {
          [Op.or]: [{ username: identifier }, { email: identifier }],
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid username or email" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        roleId: user.role_id,
      };
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

      res.cookie("token", token, {
        httpOnly: true,
        // secure: true, // Uncomment if using HTTPS
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: "Successful login", token });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  logout: async (req, res) => {
    const authHeader = req.headers["cookie"];
    if (!authHeader) {
      return res.status(200).json({
        message: "No authentication token provided, already logged out",
      });
    }

    res.clearCookie("token");
    // res.setHeader('Clear-Site-Data', '"cookies"'); // Uncomment if you want to clear all cookies
    res.status(200).json({ message: "Successful logout" });
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email: email } });
      const username = user.username;

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const userToken = await reset_token.findOne({
        where: { user_id: user.id },
      });

      const currentTime = new Date();
      const oneMinute = 60 * 1000;

      if (userToken) {
        const tokenCreatedAt = new Date(userToken.createdAt);

        console.log("Current Time:", currentTime);
        console.log("Token Created At:", tokenCreatedAt);
        console.log("Time Difference (ms):", currentTime - tokenCreatedAt);

        if (currentTime - tokenCreatedAt > oneMinute) {
          await reset_token.destroy({ where: { user_id: user.id } });
        } else {
          return res.status(400).send({
            message:
              "Please wait at least 1 minute before resending the reset password email.",
          });
        }
      }

      const token = crypto.randomBytes(20).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
      const newResetToken = await reset_token.create({
        user_id: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });

      if (newResetToken) {
        // Gunakan url FE halaman reset password
        const resetPassUrl = `${process.env.FE_URL}/auth/resetPassword?token=${token}`;
        const emailSend = await sendEmailReqResetPass(
          email,
          username,
          resetPassUrl
        );

        if (!emailSend.success) {
          return res.status(500).json({
            message: "Password reset request failed and email not sent.",
          });
        }

        return res.status(200).json({
          message: "Password reset request successful and email sent.",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword, confirmNewPass } = req.body;

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const resetTokenEntry = await reset_token.findOne({
        where: { token: hashedToken },
      });

      if (!resetTokenEntry) {
        return res.status(401).send({ message: "Invalid or expired token" });
      }

      const currentTime = new Date();
      if (resetTokenEntry.expiresAt < currentTime) {
        return res.status(401).send({ message: "Token has expired" });
      }

      const user = await User.findOne({
        where: { id: resetTokenEntry.user_id },
      });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
      }

      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (
        user.last_password_change &&
        currentTime - new Date(user.last_password_change) < oneWeek
      ) {
        return res.status(403).send({
          message: "You can only reset or change your password once a week",
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

      const newPass = await User.update(
        { password: newHashPass },
        { where: { id: user.id } }
      );

      await reset_token.destroy({
        where: { id: resetTokenEntry.id, user_id: user.id },
      });

      const email = user.email;
      const username = user.username;
      if (newPass) {
        // Gunakan url FE halaman login
        const loginUrl = `${process.env.FE_URL}/auth/login`;
        const emailSend = await sendEmailResetPass(email, username, loginUrl);

        if (!emailSend.success) {
          return res.status(500).json({
            message: "Password reset successful, but email not sent.",
          });
        }

        return res.status(200).json({
          message: "Password reset successful and email sent.",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
