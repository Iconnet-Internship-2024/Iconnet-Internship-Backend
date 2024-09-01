const multer = require("multer");

// In-Memory Storage Configuration: Store files in memory as Buffer objects
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

// Local Disk Storage Configuration: Save files to the local disk
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     if (file.fieldname === "photo") {
//       cb(null, "uploads/images");
//     } else if (file.fieldname === "education_transcript") {
//       cb(null, "uploads/transcripts");
//     } else if (file.fieldname === "cover_letter") {
//       cb(null, "uploads/cover_letters");
//     } else if (file.fieldname === "proposal") {
//       cb(null, "uploads/proposals");
//     } else {
//       cb(null, "uploads/others");
//     }
//   },
//   filename: function (req, file, cb) {
//     const dateTime = new Date().toISOString().replace(/:/g, "-");

//     const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '-');

//     cb(null, `${file.fieldname}-${dateTime}-${sanitizedOriginalName}`);
//   },
// });

// const allowedTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/gif",
//   "image/bmp",
//   "image/webp",
//   "image/svg+xml",
//   "image/tiff",
//   "image/x-icon",
//   "application/pdf"
// ];

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Unsupported file type"), false);
//     }
//   },
// });

module.exports = upload;
