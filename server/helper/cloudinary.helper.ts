import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a local file to Cloudinary and deletes it locally afterward.
 * @param localFilePath Path to the local file (from multer temp disk)
 * @param folder Cloudinary folder name
 * @param resourceType 'image' | 'raw' | 'video' | 'auto'
 */
export const uploadToCloudinary = async (
  localFilePath: string,
  folder: string = 'portfolio',
  resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto'
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: folder,
      resource_type: resourceType,
    });
    // Clean up local temp file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return result.secure_url;
  } catch (error) {
    // Clean up local temp file on error
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error;
  }
};
