const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');  


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads',  
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],  
    resource_type: 'raw',  
  },
});


const fileSizeLimit = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only PDF files and image files (JPG, JPEG, PNG) are allowed'), false);
  }
  cb(null, true);
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileSizeLimit,  
  },
  fileFilter: fileFilter, 
});



module.exports = upload;