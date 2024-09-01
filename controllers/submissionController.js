const {
  submission,
  User,
  applicant,
  job_division,
  program,
} = require("../models");
const { Op } = require("sequelize");
const storage = require("../config/firebase");
const {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const {
  sendSubmissionNotifToAdmin,
  sendSubmissionNotifToApplicant,
  sendSubmissionStatusUpdateEmail,
} = require("../utils/sendEmail");
const imagekit = require("../config/imagekit");

module.exports = {
  getAllSubmissions: async (req, res) => {
    try {
      const submissions = await submission.findAll({
        include: [
          {
            model: User,
            attributes: ["username", "email"],
          },
          {
            model: job_division,
            attributes: ["name"],
          },
          {
            model: program,
            attributes: ["name"],
          },
        ],
      });
      res.status(200).json({
        message: "Get All Submission",
        data: submissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getSubmissionById: async (req, res) => {
    try {
      const { id } = req.params;

      const submissionData = await submission.findByPk(id, {
        include: {
          model: User,
          attributes: ["email", "username"],
          include: [
            {
              model: applicant,
            },
          ],
        },
      });

      if (!submissionData) {
        return res.status(404).json({
          status: "failed",
          message: "Submission not found",
        });
      }

      res.status(200).json({
        status: "Successfully get submission data",
        data: submissionData,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getSubmissionByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;

      const existingSubmission = await submission.findOne({
        where: { user_id: user_id },
      });

      if (!existingSubmission) {
        return res.status(404).json({
          status: "failed",
          message: "Submission not found",
        });
      }

      res.status(200).json({
        message: "Successfully get submission data",
        data: existingSubmission,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getSubmissionStatusByUserId: async (req, res) => {
    try {
      const { userId } = req.user;

      const submissionStatus = await submission.findOne({
        attributes: ["status"],
        where: { user_id: userId },
      });

      if (!submissionStatus) {
        return res.status(404).json({
          status: "failed",
          message: "Submission not found",
        });
      }

      res.status(200).json({
        message: "Successfully get submission status",
        data: submissionStatus,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getAllDeletedSubmissions: async (req, res) => {
    try {
      const deletedSubmissions = await submission.findAll({
        where: {
          deletedAt: { [Op.ne]: null },
        },
        paranoid: false,
      });

      if (deletedSubmissions.length === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No deleted submissions found",
        });
      }

      res.status(200).json({
        message: "Successfully retrieved deleted submissions",
        data: deletedSubmissions,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addSubmission: async (req, res) => {
    try {
      const { userId } = req.user;
      const { job_division_id, program_id, start_date, end_date } = req.body;

      const cover_letter = req.files["cover_letter"]
        ? req.files["cover_letter"][0]
        : null;
      const proposal = req.files["proposal"] ? req.files["proposal"][0] : null;

      if (
        !userId ||
        !job_division_id ||
        !program_id ||
        !start_date ||
        !end_date ||
        !cover_letter
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const existingSubmission = await submission.findOne({
        where: { user_id: userId },
      });

      if (existingSubmission) {
        return res.status(400).json({
          status: "failed",
          message: "Submission already exists",
        });
      }

      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;

      const clFileName = `${cover_letter.originalname}-${dateTime}`;
      const clStorageRef = ref(storage, `files/cover_letters/${clFileName}`);
      const clMetadata = {
        contentType: cover_letter.mimetype,
      };

      const clSnapshot = await uploadBytesResumable(
        clStorageRef,
        cover_letter.buffer,
        clMetadata
      );

      const clURL = await getDownloadURL(clSnapshot.ref);

      let proposalURL = null;
      if (proposal) {
        const proposalFileName = `${proposal.originalname}-${dateTime}`;
        const proposalStorageRef = ref(
          storage,
          `files/proposals/${proposalFileName}`
        );
        const proposalMetadata = { contentType: proposal.mimetype };
        const proposalSnapshot = await uploadBytesResumable(
          proposalStorageRef,
          proposal.buffer,
          proposalMetadata
        );
        proposalURL = await getDownloadURL(proposalSnapshot.ref);
      }

      const newSubmission = {
        user_id: userId,
        job_division_id,
        program_id,
        start_date,
        end_date,
        cover_letter: clURL,
        proposal: proposalURL,
      };

      const addedSubmission = await submission.create(newSubmission);

      if (addedSubmission) {
        const userSubmission = await User.findOne({
          where: { id: userId },
        });

        if (!userSubmission) {
          return res.status(404).json({
            status: "failed",
            message: "Applicant not found",
          });
        }

        const applicantEmail = userSubmission.email;
        const applicantUsername = userSubmission.username;

        const allAdmins = await User.findAll({
          where: { role_id: 3 },
        });

        const adminEmails = allAdmins.map((admin) => admin.email);
        const adminUsernames = allAdmins.map((admin) => admin.username);

        const applicantEmailSend = await sendSubmissionNotifToApplicant(
          applicantEmail,
          applicantUsername
        );

        const adminEmailPromises = adminEmails.map((email, index) =>
          sendSubmissionNotifToAdmin(
            email,
            adminUsernames[index],
            applicantUsername
          )
        );

        return res.status(201).json({
          message: "Successfully added submission and all emails sent.",
          data: addedSubmission,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addSubmissionIm: async (req, res) => {
    try {
      const { userId } = req.user;
      const { job_division_id, program_id, start_date, end_date } = req.body;

      const cover_letter = req.files["cover_letter"]
        ? req.files["cover_letter"][0]
        : null;
      const proposal = req.files["proposal"] ? req.files["proposal"][0] : null;

      if (
        !userId ||
        !job_division_id ||
        !program_id ||
        !start_date ||
        !end_date ||
        !cover_letter
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      const existingSubmission = await submission.findOne({
        where: { user_id: userId },
      });

      if (existingSubmission) {
        return res.status(400).json({
          status: "failed",
          message: "Submission already exists",
        });
      }

      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + " " + time;

      const clFileName = `${cover_letter.originalname}-${dateTime}`;
      const clFolder = "/Files/Cover_Letters";

      const clUploadResponse = await imagekit.upload({
        file: cover_letter.buffer,
        fileName: clFileName,
        folder: clFolder,
        useUniqueFileName: true,
      });

      const clURL = clUploadResponse.url;

      let proposalURL = null;
      if (proposal) {
        const proposalFileName = `${proposal.originalname}-${dateTime}`;
        const proposalFolder = "/Files/Proposals";

        const proposalUploadResponse = await imagekit.upload({
          file: proposal.buffer,
          fileName: proposalFileName,
          folder: proposalFolder,
          useUniqueFileName: true,
        });

        proposalURL = proposalUploadResponse.url;
      }

      const newSubmission = {
        user_id: userId,
        job_division_id,
        program_id,
        start_date,
        end_date,
        cover_letter: clURL,
        proposal: proposalURL,
      };

      const addedSubmission = await submission.create(newSubmission);

      if (addedSubmission) {
        const userSubmission = await User.findOne({
          where: { id: userId },
        });

        if (!userSubmission) {
          return res.status(404).json({
            status: "failed",
            message: "Applicant not found",
          });
        }

        const applicantEmail = userSubmission.email;
        const applicantUsername = userSubmission.username;

        const allAdmins = await User.findAll({
          where: { role_id: 3 },
        });

        const adminEmails = allAdmins.map((admin) => admin.email);
        const adminUsernames = allAdmins.map((admin) => admin.username);

        await sendSubmissionNotifToApplicant(applicantEmail, applicantUsername);

        const adminEmailPromises = adminEmails.map((email, index) =>
          sendSubmissionNotifToAdmin(
            email,
            adminUsernames[index],
            applicantUsername
          )
        );

        await Promise.all(adminEmailPromises);

        return res.status(201).json({
          message: "Successfully added submission and all emails sent.",
          data: addedSubmission,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updateSubmissionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const existingSubmission = await submission.findOne({
        where: { id: id },
      });

      if (!existingSubmission) {
        return res.status(400).json({
          status: "failed",
          message: "No submission found",
        });
      }

      const validStatus = ["pending", "in_process", "accepted", "rejected"];

      if (!validStatus.includes(status)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for status",
        });
      }

      const [updated] = await submission.update(
        { status: status },
        { where: { id: id } }
      );

      if (updated === 0) {
        return res.status(404).json({
          status: "failed",
          message: "No changes made to status",
        });
      } else {
        const updatedStatusSubmission = await submission.findByPk(id, {
          include: {
            model: User,
            attributes: ["email", "username"],
            include: [
              {
                model: applicant,
                attributes: ["name"],
              },
            ],
          },
        });
        const newStatus = updatedStatusSubmission.status;
        const applicantEmail = updatedStatusSubmission.User.email;
        const applicantName = updatedStatusSubmission.User.username;

        const emailResponse = await sendSubmissionStatusUpdateEmail(
          applicantEmail,
          applicantName,
          newStatus
        );

        res.status(200).json({
          message: "Successfully updated submission status",
          data: updatedStatusSubmission,
          email: emailResponse,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  softDeleteSubmission: async (req, res) => {
    try {
      const { id } = req.params;

      const existingSubmission = await submission.findOne({
        where: { id: id },
      });

      if (!existingSubmission) {
        return res.status(404).json({
          status: "failed",
          message: "Submission not found",
        });
      }

      const deleted = await submission.destroy({ where: { id: id } });

      if (deleted) {
        res.status(200).json({
          message: "Successfully deleted submission",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  hardDeleteSubmission: async (req, res) => {
    try {
      const { id } = req.params;

      const existingSubmission = await submission.findOne({
        where: { id: id },
        paranoid: false,
      });

      if (!existingSubmission) {
        return res.status(404).json({
          status: "failed",
          message: "Submission not found",
        });
      }

      const decodePath = (url) => {
        const path = url.split("/o/")[1].split("?")[0];
        return decodeURIComponent(path);
      };

      if (existingSubmission.cover_letter) {
        const clPath = decodePath(existingSubmission.cover_letter);
        const clRef = ref(storage, `${clPath}`);
        await deleteObject(clRef);
      }

      if (existingSubmission.proposal) {
        const proposalPath = decodePath(existingSubmission.proposal);
        const proposalRef = ref(storage, `${proposalPath}`);
        await deleteObject(proposalRef);
      }

      const deleted = await submission.destroy({
        where: { id: id },
        force: true, // Force hard delete
      });

      if (deleted) {
        res.status(200).json({
          message: "Successfully hard deleted submission",
        });
      } else {
        res.status(500).json({
          message: "Failed to delete submission",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  hardDeleteSubmissionIm: async (req, res) => {
    try {
      const { id } = req.params;

      const existingSubmission = await submission.findOne({
        where: { id: id },
        paranoid: false,
      });

      if (!existingSubmission) {
        return res.status(404).json({
          status: "failed",
          message: "Submission not found",
        });
      }

      const extractFileName = (url) => {
        const parts = url.split("/");
        return parts.pop().split("?")[0];
      };

      if (existingSubmission.cover_letter) {
        const clFileName = extractFileName(existingSubmission.cover_letter);

        imagekit.listFiles(
          {
            folder: "/Files/Cover_Letters",
            name: clFileName,
          },
          function (error, result) {
            if (error) {
              console.log("Error finding file:", error);
              return res.status(500).json({
                message: "Failed to find cover letter file",
                error: error,
              });
            }

            if (result.length > 0) {
              const fileId = result[0].fileId;

              imagekit.deleteFile(fileId, function (error) {
                if (error) {
                  console.log("Error deleting file:", error);
                  return res.status(500).json({
                    message: "Failed to delete cover letter file",
                    error: error,
                  });
                }
              });
            }
          }
        );
      }

      if (existingSubmission.proposal) {
        const proposalFileName = extractFileName(existingSubmission.proposal);

        imagekit.listFiles(
          {
            folder: "/Files/Proposals",
            name: proposalFileName,
          },
          function (error, result) {
            if (error) {
              console.log("Error finding file:", error);
              return res.status(500).json({
                message: "Failed to find proposal file",
                error: error,
              });
            }

            if (result.length > 0) {
              const fileId = result[0].fileId;

              imagekit.deleteFile(fileId, function (error) {
                if (error) {
                  console.log("Error deleting file:", error);
                  return res.status(500).json({
                    message: "Failed to delete proposal file",
                    error: error,
                  });
                }
              });
            }
          }
        );
      }

      const deleted = await submission.destroy({
        where: { id: id },
        force: true,
      });

      if (deleted) {
        res.status(200).json({
          message: "Successfully hard deleted submission",
        });
      } else {
        res.status(500).json({
          message: "Failed to delete submission",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
