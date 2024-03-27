import multer from "multer";
import path, { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import { rejects } from "assert";

cloudinary.config({
  cloud_name: "drjjje7qz",
  api_key: "796695446267428",
  api_secret: "leoCwLm7znbCJj0eFvWb1rcJOoo",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: any) => {
  return new Promise((resolve, rejects) => {
    cloudinary.uploader.upload(
      file.path,
      { public_id: file.originalname },
      (error, result) => {
        if (error) {
          rejects(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export const fileUploder = {
  upload,
  uploadToCloudinary,
};
