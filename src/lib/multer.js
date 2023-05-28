// External imports
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where uploaded files will be stored
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for each uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const fileName = file.fieldname + "-" + uniqueSuffix + extension;
    cb(null, fileName);
  },
});

const validateFile = function (file, cb) {
  let allowedFileTypes = /jpeg|jpg|png/;
  const extension = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedFileTypes.test(file.mimetype);

  if (extension && mimeType) {
    return cb(null, true);
  } else {
    cb("Invalid file type. Only JPEG, PNG files are allowed.");
  }
};

const uploader = multer({
  storage: storage,
  limits: { fileSize: 800000 }, // Set the maximum file size in bytes
  fileFilter: function (req, file, callback) {
    validateFile(file, callback);
  },
});

module.exports = uploader;
