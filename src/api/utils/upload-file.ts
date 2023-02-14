import multer from 'multer';
const cloudinary = require('cloudinary').v2;
import fs from 'fs';
import util from 'util';
//@ts-ignore
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_NAME } from '../../config';

const unLinkFile = util.promisify(fs.unlink);

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const imageId = () => Math.random().toString(36).substr(2, 4);

const uploadToCloud = async (path:string) => {
  const response = await cloudinary.uploader.upload(path, { resource_type: 'auto', public_id: `jemiEats/files${imageId()}` });
  await unLinkFile(path);
  return response.secure_url;
};

const uploadLocal = multer({ dest: 'uploads/' });

module.exports = {
  uploadLocal,
  uploadToCloud,
};
