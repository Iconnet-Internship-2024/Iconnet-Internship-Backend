const { User } = require("../models");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/nodemailerConfig");

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, password, confirmPass } = req.body;
      const existingUsername = await User.findOne({
        where: { username: username },
      });
      if (existingUsername) {
        return res.status(400).json({
          message: `Username ${existingUsername.username} is already registered. Please use a different username.`,
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const existingEmail = await User.findOne({
        where: { email: email },
      });
      if (existingEmail) {
        return res.status(400).json({
          message: `Email ${existingEmail.email} is already registered. Please use a different email.`,
        });
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

      const salt = await bcrypt.genSalt();
      const hashPass = await bcrypt.hash(password, salt);

      const registerAcc = await User.create({
        username: username,
        email: email,
        password: hashPass,
        role: "user",
      });
      if (registerAcc) {
        return res
          .status(201)
          .json({ message: "User registered successfully" });
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
        return res.status(400).json({ message: "Invalid username/email" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const payload = {
        userId: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };
      const jwtSecret = process.env.JWT_SECRET;
      const token = jwt.sign(payload, jwtSecret, { expiresIn: "1d" });

      res.cookie("token", token, {
        httpOnly: true,
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
    res.clearCookie("token");
    res.status(200).json({ message: "Successful logout" });
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });

      // Isi resetPassURL dengan URL yang menuju ke halaman reset password
      const resetPassUrl = `http://localhost:3000/auth/reset-password/${token}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Reset Password",
        html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="${resetPassUrl}">Reset Password</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send({ message: error.message });
        }
        res.status(200).send({ message: "Email sent" });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken) {
        return res.status(401).send({ message: "Invalid token" });
      }

      const user = await User.findOne({ where: { id: decodedToken.userId } });

      if (!user) {
        return res.status(401).send({ message: "User not found" });
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

      const loginUrl = `http://localhost:3000/auth/login`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Successful",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1 style="color: #4CAF50;">Password Reset Successful</h1>
            <p>Dear User,</p>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <p>Please use the following link to log in:</p>
            <a href="${loginUrl}" style="color: #4CAF50;">Log In</a>
            <p>If you did not request this change or believe this was a mistake, please contact our support team immediately.</p>
            <p>Best regards,</p>
            <p>Your Company Team</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 0.9em; color: #888;">
              If you did not request a password reset, please ignore this email or 
              <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">contact support</a> if you have any questions.
            </p>
          </div>
        `,
      };

      if (newPass) {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return res.status(500).send({ message: error.message });
          }
          res.status(200).send({ message: "Reset password success. Email sent" });
        });
      } else {
        res.status(400).send({ message: "New password not provided" });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  },
};
