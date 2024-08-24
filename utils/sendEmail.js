const transporter = require("../config/nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent" };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const generateEmailTemplate = (username, content) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Hi ${username},</h2>
    ${content}
    <p>Best regards,</p>
    <p>The Team</p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
    <p style="font-size: 0.9em; color: #888;">
      If you have any questions, please feel free to 
      <a href="mailto:${process.env.EMAIL_USER}" style="color: #4CAF50; text-decoration: none;">contact us</a>.
    </p>
  </div>
`;

module.exports = {
  sendEmailRegister: (email, username) => {
    const subject = "Welcome to Pengajuan Magang/KP dan PKL PLN ICON PLUS";
    const content = `
      <p>Thank you for registering with us.</p>
      <p>We're excited to have you on board. If you have any questions, feel free to reach out to our support team.</p>
    `;
    return sendEmail(email, subject, generateEmailTemplate(username, content));
  },

  sendEmailReqResetPass: (email, username, resetPassUrl) => {
    const subject = "Reset Your Password";
    const content = `
      <p>There was a request to change your password!</p>
      <p>Please click on the following link to reset your password:</p>
      <a href="${resetPassUrl}">Reset Password</a>
      <p>The link will expire in 10 minutes.</p>
      <p>If you didn't request a password reset, please ignore this email.</p>
    `;
    return sendEmail(email, subject, generateEmailTemplate(username, content));
  },

  sendEmailResetPass: (email, username, loginUrl) => {
    const subject = "Password Reset Successfully";
    const content = `
      <p>Your password has been successfully reset. You can now log in with your new password.</p>
      <p>Please use the following link to log in:</p>
      <a href="${loginUrl}">Log In</a>
      <p>If you did not request this change or believe this was a mistake, please contact our support team immediately.</p>
    `;
    return sendEmail(email, subject, generateEmailTemplate(username, content));
  },

  sendEmailUpdatePass: (email, username) => {
    const subject = "Password Changed Successfully";
    const content = `
      <p>Your password has been successfully reset. You can now continue using the application with your new password.</p>
      <p>If you did not request this change or believe this was a mistake, please contact our support team immediately.</p>
    `;
    return sendEmail(email, subject, generateEmailTemplate(username, content));
  },

  sendSubmissionNotifToApplicant: (applicantEmail, applicantUsername) => {
    const subject = "Submission Created Successfully";
    const content = `
      <p>Your submission has been successfully created. Our team will review it and get back to you as soon as possible.</p>
      <p>Thank you for applying!</p>
    `;
    return sendEmail(
      applicantEmail,
      subject,
      generateEmailTemplate(applicantUsername, content)
    );
  },

  sendSubmissionNotifToAdmin: (email, adminUsername, applicantName) => {
    const subject = "New Submission Received";
    const content = `
      <p>A new submission has been received from ${applicantName}. Please review the submission at your earliest convenience.</p>
      <p>Thank you for your attention.</p>
    `;
    return sendEmail(
      email,
      subject,
      generateEmailTemplate(adminUsername, content)
    );
  },

  sendSubmissionStatusUpdateEmail: (
    applicantEmail,
    applicantName,
    newStatus
  ) => {
    let subject, content;

    switch (newStatus) {
      case "in_process":
        subject = "Your Submission is Being Reviewed";
        content =
          "<p>We wanted to let you know that your submission is currently being reviewed. We will notify you once a decision has been made.</p>";
        break;
      case "accepted":
        subject = "Your Submission Has Been Accepted";
        content =
          "<p>Congratulations! Your submission has been accepted. We will be in touch with further details shortly.</p>";
        break;
      case "rejected":
        subject = "Your Submission Has Been Rejected";
        content =
          "<p>We regret to inform you that your submission has been rejected. You are welcome to apply again in the future.</p>";
        break;
      default:
        return { success: false, message: "Invalid status" };
    }

    return sendEmail(
      applicantEmail,
      subject,
      generateEmailTemplate(applicantName, content)
    );
  },
};
