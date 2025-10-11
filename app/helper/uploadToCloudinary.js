import cloudinary from '../config/cloudinary.config.js'
import streamifier from "streamifier";
const uploadToCloudinary = (buffer, folder = "myapp/products") => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        {folder,resource_type:"image"},
        (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
})

export default uploadToCloudinary 