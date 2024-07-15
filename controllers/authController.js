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

      // const passwordRegex =
      //   /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      // if (!passwordRegex.test(password)) {
      //   return res.status(403).json({
      //     message:
      //       "Password harus mengandung setidaknya satu huruf, satu angka, dan satu simbol",
      //   });
      // }

      const passwordRegex = /^.{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long",
        });
      }

      // const minPasswordLength = 8;
      // if (password.length < minPasswordLength) {
      //   return res.status(403).json({
      //     message: `Password harus memiliki minimal ${minPasswordLength} karakter`,
      //   });
      // }

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

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Log informasi pengguna sebelum membuat token
      // console.log("User info before creating token:", {
      //   userId: user.id,
      //   username: user.username,
      //   email: user.email,
      //   role: user.role,
      // });

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

  testEmail: async (req, res) => {
    const email = "nafshadia@gmail.com";
    const mailOptions = {
      // from: process.env.MAILTRAP_USER,
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Test Email",
      text: `Welcome!
      
      Thank you for using Nodemailer!
      
      Best regards,
      Team`,
      html: `<b>Welcome <strong>${email}</strong>!</b>
            <br>
            <p>Thank you for your attention</p>
            <br>
            <p>Best regards,<br>Team</p>`,
    };

    try {
      const sendEmail = await transporter.sendMail(mailOptions);
      console.log("Mail sent: ", sendEmail);
      if (sendEmail) {
        return res.status(200).json({ message: "Successfully sent email" });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return res
        .status(500)
        .json({ message: "Failed to send email", error: error.message });
    }
  },

  forgetPassword: async (req, res) => {
    try {
      const user = await User.findOne({ where: { mail: req.body.email } });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "10m",
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Reset Password",
        html: `<h1>Reset Your Password</h1>
      <p>Click on the following link to reset your password:</p>
      <a href="http://localhost:3000/auth/reset-password/${token}">Reset Password</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          return res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: "Email sent" });
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const token = req.params.token;
      const { newPassword } = req.body;

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // console.log("Decoded token:", decodedToken);

      if (!decodedToken) {
        return res.status(401).send({ message: "Invalid token" });
      }

      const user = await User.findOne({ where: { id: decodedToken.userId } });

      // console.log("Data user: ", user);

      if (!user) {
        return res.status(401).send({ message: "no user found" });
      }

      const passwordRegex = /^.{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(403).json({
          message: "Password harus minimal 8 karakter",
        });
      }

      const salt = await bcrypt.genSalt();
      const newHashPass = await bcrypt.hash(newPassword, salt);

      // console.log("New hashed password:", newHashPass);

      const updateNewPass = await User.update(
        { password: newHashPass },
        { where: { id: user.id } }
      );

      // console.log(updateNewPass);

      if (updateNewPass) {
        return res.status(200).send({ message: "Password updated" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};
