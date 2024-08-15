const { applicant } = require("../models");
const storage = require("../config/firebase");
const {
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

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
};
