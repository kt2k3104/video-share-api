import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

const cloudinaryConfig = {
  cloudinary_name: process.env.CLOUDINARY_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};

export { cloudinaryConfig };
