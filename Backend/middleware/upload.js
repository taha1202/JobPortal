// middleware/upload.js
const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({

  destination: (req, picture, cb) => {
    const uploadDir = path.resolve(__dirname, '..', 'uploads', 'images'); 
    console.log("Uploading to:", uploadDir);  
    cb(null, uploadDir);

  },
  filename: (req, picture, cb) => {
    cb(null, `${Date.now()}-${picture.originalname}`);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.resolve(__dirname, '..', 'uploads', 'resume'); 
    console.log("Uploading to:", uploadDir);  
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    console.log('Only .pdf and .docx files are allowed');
    cb(new Error('Only .pdf and .docx files are allowed'), false);
  }
};

const ImagefileFilter = (req, picture, cb) => {
  
  const validExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  console.log("Checked Ext");
  const ext = path.extname(picture.originalname).toLowerCase();
  console.log('Uploaded file extension:', ext);
  if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const uploadRes = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: fileFilter
});

const uploadImage = multer({
  storage: imageStorage,
  fileFilter: ImagefileFilter,
 
});

module.exports = {uploadImage,uploadRes};
