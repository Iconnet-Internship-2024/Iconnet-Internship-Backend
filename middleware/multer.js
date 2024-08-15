const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
});

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Unsupported file type"), false);
//     }
//   },
// });

module.exports = upload;
