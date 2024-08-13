const transporter = require("../config/nodemailer");

module.exports = {
  sendEmailRegister: async (email, username) => {
    try {
      const subject = "Welcome to Pengajuan Magang/KP dan PKL PLN ICON PLUS";
      const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>Dear ${username},</h2>
              <p>Thank you for registering with us.</p>
              <p>We're excited to have you on board. If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,</p>
              <p>The Team</p>
            </div>
          `;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  sendEmailReqResetPass: async (email, username, resetPassUrl) => {
    try {
      const subject = "Reset Your Password";
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">      
          <h2>Hi ${username},</h2>
          <p>There was a request to change your password!</p>
          <p>Please click on the following link to reset your password:</p>
          <a href="${resetPassUrl}">Reset Password</a>
          <p>The link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
        </div>
    `;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html,
      };

      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  sendEmailResetPass: async (email, username, loginUrl) => {
    try {
      const subject = "Password Reset Successfully";
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${username},</h2>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <p>Please use the following link to log in:</p>
          <a href="${loginUrl}">Log In</a>
          <p>If you did not request this change or believe this was a mistake, please contact our support team immediately.</p>
          <p>Best regards,</p>
          <p>Your Company Team</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #888;">
            If you did not request a password reset, please ignore this email or 
            <a href="mailto:support@example.com" style="color: #4CAF50; text-decoration: none;">contact support</a> if you have any questions.
          </p>
        </div>
      `;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html,
      };
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  sendEmailUpdatePass: async (email, username) => {
    try {
      const subject = "Password Changed Successfully";
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hi ${username},</h2>
          <p>Your password has been successfully reset. You can now continue using the application with your new password.</p>
          <p>If you did not request this change or believe this was a mistake, please contact our support team immediately.</p>
          <p>Best regards,</p>
          <p>The Team</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #888;">
            If you did not request a password reset, please ignore this email or 
            <a href="mailto:${process.env.EMAIL_USER}" style="color: #4CAF50; text-decoration: none;">contact support</a> if you have any questions.
          </p>
        </div>
      `;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: html,
      };
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};
