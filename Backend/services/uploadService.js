import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import {cloudinaryConfig} from '../config/config.js';
cloudinary.config({
  cloud_name: cloudinaryConfig.cloud_name ,
  api_key: cloudinaryConfig.api_key ,
  api_secret: cloudinaryConfig.api_secret ,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ToolSwap',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

export default upload;