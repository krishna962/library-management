// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Upload folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // ✅ uploads folder me save hoga
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({ storage: storage });
module.exports = upload;
