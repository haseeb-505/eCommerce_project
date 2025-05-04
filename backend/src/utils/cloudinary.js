import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from '../utils/ApiError.js';;

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // uploading the file to cloudinary
        const response = await cloudinary.v2.uploader.upload(localFilePath, {
          resource_type: "auto"})
        
        //   after uploading file, unlink the localFile
        fs.unlinkSync(localFilePath);

        // return the response from cloudinary
        return response;
    } catch (error) {
        // unlick the loaclFilePath
        fs.unlinkSync(localFilePath);
        console.log("Error in uploading the file to cloudinary", error);
        throw new ApiError("File upload failed", 500);
    }
}

export { uploadToCloudinary };