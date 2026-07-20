const multer = require("multer");

// files are kept in memory as a buffer, then pushed straight to ImageKit
// (never written to local disk)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jfif",
      "application/pdf",
      "application/octet-stream", // fallback for .jfif/odd files where mimetype detection is unreliable
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, JFIF, PDF allowed."), false);
    }
  },
});

module.exports = upload;