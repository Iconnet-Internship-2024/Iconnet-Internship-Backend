const { applicant } = require("../models");
const storage = require("../config/firebase");
const {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const imagekit = require("../config/imagekit");
const fs = require("fs");
const path = require("path");

module.exports = {
  getAllApplicants: async (req, res) => {
    try {
      const applicants = await applicant.findAll();
      res.status(200).json({
        message: "Get All Applicants",
        data: applicants,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getApplicantById: async (req, res) => {
    try {
      const { id } = req.params;

      const existingApplicant = await applicant.findByPk(id);

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      res.status(200).json({
        status: "Successfully get applicant",
        data: existingApplicant,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  getApplicantByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;
      const existingApplicant = await applicant.findOne({
        where: { user_id: user_id },
      });

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      res.status(200).json({
        message: `Successfully get applicant with user ID ${user_id}`,
        data: existingApplicant,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addApplicant: async (req, res) => {
    try {
      const { userId } = req.user;
      const {
        name,
        place_of_birth,
        date_of_birth,
        gender,
        phone_number,
        city,
        address,
        religion,
        education_degree,
        student_id,
        education_institution,
        education_major,
        education_faculty,
      } = req.body;

      const photo = req.files["photo"] ? req.files["photo"][0] : null;
      const education_transcript = req.files["education_transcript"]
        ? req.files["education_transcript"][0]
        : null;

      const validGenders = ["male", "female"];
      const validReligions = [
        "islam",
        "kristen",
        "katolik",
        "hindu",
        "buddha",
        "konghucu",
        "lainnya",
      ];
      const validEducationDegrees = [
        "D1",
        "D2",
        "D3",
        "D4",
        "S1",
        "S2",
        "S3",
        "SMK",
        "SMA",
      ];

      if (
        !photo ||
        !userId ||
        !name ||
        !place_of_birth ||
        !date_of_birth ||
        !gender ||
        !phone_number ||
        !city ||
        !address ||
        !religion ||
        !education_degree ||
        !student_id ||
        !education_institution ||
        !education_major ||
        !education_transcript
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for gender",
        });
      }

      if (!validReligions.includes(religion)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for religion",
        });
      }

      if (!validEducationDegrees.includes(education_degree)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for education degree",
        });
      }

      const existingApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      if (existingApplicant) {
        return res.status(400).json({
          status: "failed",
          message: "Applicant already exists",
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

      const photoFileName = `${photo.originalname}-${dateTime}`;
      const photoStorageRef = ref(storage, `images/${photoFileName}`);
      const photoMetadata = {
        contentType: photo.mimetype,
      };

      const photoSnapshot = await uploadBytesResumable(
        photoStorageRef,
        photo.buffer,
        photoMetadata
      );

      const photoURL = await getDownloadURL(photoSnapshot.ref);

      const transcriptFileName = `${education_transcript.originalname}-${dateTime}`;
      const transcriptStorageRef = ref(
        storage,
        `files/transcripts/${transcriptFileName}`
      );
      const transcriptMetadata = { contentType: education_transcript.mimetype };
      const transcriptSnapshot = await uploadBytesResumable(
        transcriptStorageRef,
        education_transcript.buffer,
        transcriptMetadata
      );
      const transcriptURL = await getDownloadURL(transcriptSnapshot.ref);

      const newApplicant = {
        user_id: userId,
        photo: photoURL,
        name,
        place_of_birth,
        date_of_birth,
        gender,
        phone_number,
        city,
        address,
        religion,
        education_degree,
        student_id,
        education_institution,
        education_major,
        education_faculty,
        education_transcript: transcriptURL,
      };

      const addedApplicant = await applicant.create(newApplicant);

      res.status(200).json({
        message: "Successfully added applicant",
        data: addedApplicant,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addApplicantIm: async (req, res) => {
    try {
      const { userId } = req.user;
      const {
        name,
        place_of_birth,
        date_of_birth,
        gender,
        phone_number,
        city,
        address,
        religion,
        education_degree,
        student_id,
        education_institution,
        education_major,
        education_faculty,
      } = req.body;

      const photo = req.files["photo"] ? req.files["photo"][0] : null;
      const education_transcript = req.files["education_transcript"]
        ? req.files["education_transcript"][0]
        : null;

      const validGenders = ["male", "female"];
      const validReligions = [
        "islam",
        "kristen",
        "katolik",
        "hindu",
        "buddha",
        "konghucu",
        "lainnya",
      ];
      const validEducationDegrees = [
        "D1",
        "D2",
        "D3",
        "D4",
        "S1",
        "S2",
        "S3",
        "SMK",
        "SMA",
      ];

      if (
        !photo ||
        !userId ||
        !name ||
        !place_of_birth ||
        !date_of_birth ||
        !gender ||
        !phone_number ||
        !city ||
        !address ||
        !religion ||
        !education_degree ||
        !student_id ||
        !education_institution ||
        !education_major ||
        !education_transcript
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for gender",
        });
      }

      if (!validReligions.includes(religion)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for religion",
        });
      }

      if (!validEducationDegrees.includes(education_degree)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for education degree",
        });
      }

      const existingApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      if (existingApplicant) {
        return res.status(400).json({
          status: "failed",
          message: "Applicant already exists",
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

      const photoUploadResponse = await imagekit.upload({
        file: photo.buffer,
        fileName: `${photo.originalname}-${dateTime}`,
        folder: "/Images/",
      });

      const transcriptUploadResponse = await imagekit.upload({
        file: education_transcript.buffer,
        fileName: `${education_transcript.originalname}-${dateTime}`,
        folder: "/Files/Transcripts/",
      });

      const newApplicant = {
        user_id: userId,
        photo: photoUploadResponse.url,
        name,
        place_of_birth,
        date_of_birth,
        gender,
        phone_number,
        city,
        address,
        religion,
        education_degree,
        student_id,
        education_institution,
        education_major,
        education_faculty,
        education_transcript: transcriptUploadResponse.url,
      };

      const addedApplicant = await applicant.create(newApplicant);

      res.status(200).json({
        message: "Successfully added applicant",
        data: addedApplicant,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  addApplicantLocal: async (req, res) => {
    try {
      const { userId } = req.user;
      const {
        name,
        place_of_birth,
        date_of_birth,
        gender,
        phone_number,
        city,
        address,
        religion,
        education_degree,
        student_id,
        education_institution,
        education_major,
        education_faculty,
      } = req.body;

      const photo = req.files["photo"] ? req.files["photo"][0] : null;
      const education_transcript = req.files["education_transcript"]
        ? req.files["education_transcript"][0]
        : null;

      const validGenders = ["male", "female"];
      const validReligions = [
        "islam",
        "kristen",
        "katolik",
        "hindu",
        "buddha",
        "konghucu",
        "lainnya",
      ];
      const validEducationDegrees = [
        "D1",
        "D2",
        "D3",
        "D4",
        "S1",
        "S2",
        "S3",
        "SMK",
        "SMA",
      ];

      if (
        !photo ||
        !userId ||
        !name ||
        !place_of_birth ||
        !date_of_birth ||
        !gender ||
        !phone_number ||
        !city ||
        !address ||
        !religion ||
        !education_degree ||
        !student_id ||
        !education_institution ||
        !education_major ||
        !education_transcript
      ) {
        return res.status(400).json({
          status: "failed",
          message: "Missing required field(s)",
        });
      }

      if (!validGenders.includes(gender)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for gender",
        });
      }

      if (!validReligions.includes(religion)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for religion",
        });
      }

      if (!validEducationDegrees.includes(education_degree)) {
        return res.status(400).json({
          status: "failed",
          message: "Invalid value for education degree",
        });
      }

      const existingApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      if (existingApplicant) {
        return res.status(400).json({
          status: "failed",
          message: "Applicant already exists",
        });
      }

      const photoURL = `${process.env.BASE_URL}/uploads/images/${photo.filename}`;
      const transcriptURL = `${process.env.BASE_URL}/uploads/transcripts/${education_transcript.filename}`;

      const newApplicant = {
        user_id: userId,
        photo: photoURL,
        name,
        place_of_birth,
        date_of_birth,
        gender,
        phone_number,
        city,
        address,
        religion,
        education_degree,
        student_id,
        education_institution,
        education_major,
        education_faculty,
        education_transcript: transcriptURL,
      };

      const addedApplicant = await applicant.create(newApplicant);

      res.status(200).json({
        message: "Successfully added applicant",
        data: addedApplicant,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updatePhoto: async (req, res) => {
    try {
      const userId = req.user.userId;
      const newPhoto = req.file;

      if (!newPhoto) {
        return res.status(400).json({
          status: "failed",
          message: "Photo file is required",
        });
      }

      const existingApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      if (existingApplicant.photo) {
        const oldPhotoRef = ref(storage, existingApplicant.photo);
        await deleteObject(oldPhotoRef);
      }

      const today = new Date();
      const date = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      const dateTime = `${date} ${time}`;

      const fileName = `${newPhoto.originalname}-${dateTime}`;
      const storageRef = ref(storage, `images/${fileName}`);
      const metadata = {
        contentType: newPhoto.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        newPhoto.buffer,
        metadata
      );
      const photoURL = await getDownloadURL(snapshot.ref);

      await applicant.update(
        { photo: photoURL },
        { where: { user_id: userId } }
      );

      res.status(200).json({
        message: "Successfully updated photo",
        photoURL: photoURL,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updatePhotoIm: async (req, res) => {
    try {
      const userId = req.user.userId;
      const newPhoto = req.file;

      if (!newPhoto) {
        return res.status(400).json({
          status: "failed",
          message: "Photo file is required",
        });
      }

      const existingApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      if (!existingApplicant) {
        return res.status(400).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      if (existingApplicant.photo) {
        const urlParts = existingApplicant.photo.split("/");
        const fileNameWithExtension = urlParts.pop();

        const files = await imagekit.listFiles({
          folder: "/Images",
        });

        const file = files.find((f) => f.name.includes(fileNameWithExtension));

        if (file) {
          const fileId = file.fileId;

          imagekit.deleteFile(fileId, function (error, result) {
            if (error) {
              return res.status(500).json({
                message: "Failed to delete the previous photo",
                error: error,
              });
            }
          });
        } else {
          console.log("File not found in ImageKit");
        }
      }

      const today = new Date();
      const date = `${today.getFullYear()}-${
        today.getMonth() + 1
      }-${today.getDate()}`;
      const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      const dateTime = `${date} ${time}`;

      const newFileName = `${newPhoto.originalname}-${dateTime}`;

      imagekit.upload(
        {
          file: newPhoto.buffer,
          fileName: newFileName,
          folder: "/Images",
        },
        async function (error, result) {
          if (error) {
            return res.status(500).json({
              message: "Image upload failed",
              error: error,
            });
          } else {
            const photoURL = result.url;

            await applicant.update(
              { photo: photoURL },
              { where: { user_id: userId } }
            );

            res.status(200).json({
              message: "Successfully updated photo",
              photoURL: photoURL,
            });
          }
        }
      );
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  updatePhotoLocal: async (req, res) => {
    try {
      const userId = req.user.userId;
      const newPhoto = req.file;

      if (!newPhoto) {
        return res.status(400).json({
          status: "failed",
          message: "Photo file is required",
        });
      }

      const existingApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      if (existingApplicant.photo) {
        const oldPhotoPath = path.join(
          __dirname,
          "..",
          "uploads/images",
          path.basename(existingApplicant.photo)
        );
        try {
          await fs.promises.unlink(oldPhotoPath);
        } catch (error) {
          console.error("Error deleting old photo:", error);
          return res.status(500).json({
            message: `Failed to delete old photo file: ${error}`,
          });
        }
      }

      const newFileName = newPhoto.filename;
      const newFilePath = path.join(
        __dirname,
        "..",
        "uploads/images",
        newFileName
      );

      await fs.promises.rename(newPhoto.path, newFilePath);

      const photoURL = `${process.env.BASE_URL}/uploads/images/${newFileName}`;
      await applicant.update(
        { photo: photoURL },
        { where: { user_id: userId } }
      );

      const updatePhotoApplicant = await applicant.findOne({
        where: { user_id: userId },
      });

      res.status(200).json({
        message: "Successfully updated photo",
        photoURL: updatePhotoApplicant,
      });
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteApplicant: async (req, res) => {
    try {
      const { id } = req.params;

      const existingApplicant = await applicant.findOne({
        where: { id: id },
      });

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      const decodePath = (url) => {
        const path = url.split("/o/")[1].split("?")[0];
        return decodeURIComponent(path);
      };

      if (existingApplicant.photo) {
        const photoPath = decodePath(existingApplicant.photo);
        const photoRef = ref(storage, `${photoPath}`);
        await deleteObject(photoRef);
      }

      if (existingApplicant.education_transcript) {
        const transcriptPath = decodePath(
          existingApplicant.education_transcript
        );
        const transcriptRef = ref(storage, `${transcriptPath}`);
        await deleteObject(transcriptRef);
      }

      const deleted = await applicant.destroy({ where: { id: id } });

      if (deleted) {
        res.status(200).json({
          message: "Successfully deleted applicant",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteApplicantIm: async (req, res) => {
    try {
      const { id } = req.params;

      const existingApplicant = await applicant.findOne({
        where: { id: id },
      });

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      const extractFileName = (url) => {
        const parts = url.split("/");
        return parts.pop().split("?")[0];
      };

      if (existingApplicant.photo) {
        const photoFileName = extractFileName(existingApplicant.photo);

        imagekit.listFiles(
          {
            folder: "/Images",
            name: photoFileName,
          },
          function (error, result) {
            if (error) {
              console.log("Error finding file:", error);
              return res.status(500).json({
                message: "Failed to find photo file",
                error: error,
              });
            }

            if (result.length > 0) {
              const fileId = result[0].fileId;

              imagekit.deleteFile(fileId, function (error) {
                if (error) {
                  console.log("Error deleting file:", error);
                  return res.status(500).json({
                    message: "Failed to delete photo file",
                    error: error,
                  });
                }
              });
            }
          }
        );
      }

      if (existingApplicant.education_transcript) {
        const transcriptFileName = extractFileName(
          existingApplicant.education_transcript
        );

        imagekit.listFiles(
          {
            folder: "/Files/Transcripts",
            name: transcriptFileName,
          },
          function (error, result) {
            if (error) {
              console.log("Error finding file:", error);
              return res.status(500).json({
                message: "Failed to find education transcript file",
                error: error,
              });
            }

            if (result.length > 0) {
              const fileId = result[0].fileId;

              imagekit.deleteFile(fileId, function (error) {
                if (error) {
                  console.log("Error deleting file:", error);
                  return res.status(500).json({
                    message: "Failed to delete education transcript file",
                    error: error,
                  });
                }
              });
            }
          }
        );
      }

      const deleted = await applicant.destroy({ where: { id: id } });

      if (deleted) {
        res.status(200).json({
          message: "Successfully deleted applicant",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },

  deleteApplicantLocal: async (req, res) => {
    try {
      const { id } = req.params;

      const existingApplicant = await applicant.findOne({
        where: { id: id },
      });

      if (!existingApplicant) {
        return res.status(404).json({
          status: "failed",
          message: "Applicant not found",
        });
      }

      const deleteFile = (filePath) => {
        return new Promise((resolve, reject) => {
          fs.unlink(filePath, (err) => {
            if (err) {
              if (err.code === "ENOENT") {
                resolve();
              } else {
                reject(err);
              }
            } else {
              resolve();
            }
          });
        });
      };

      if (existingApplicant.photo) {
        const photoPath = path.join(
          __dirname,
          "..",
          "uploads/images",
          path.basename(existingApplicant.photo)
        );
        try {
          await deleteFile(photoPath);
        } catch (error) {
          console.error("Error deleting photo:", error);
          return res.status(500).json({
            message: `Failed to delete photo file: ${error}`,
          });
        }
      }

      if (existingApplicant.education_transcript) {
        const transcriptPath = path.join(
          __dirname,
          "..",
          "uploads/transcripts",
          path.basename(existingApplicant.education_transcript)
        );
        try {
          await deleteFile(transcriptPath);
        } catch (error) {
          console.error("Error deleting transcript:", error);
          return res.status(500).json({
            message: `Failed to delete transcript file: ${error}`,
          });
        }
      }

      const deleted = await applicant.destroy({ where: { id: id } });

      if (deleted) {
        res.status(200).json({
          message: "Successfully deleted applicant",
        });
      } else {
        res.status(400).json({
          status: "failed",
          message: "Failed to delete applicant",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: `Internal Server Error` + error,
      });
    }
  },
};
