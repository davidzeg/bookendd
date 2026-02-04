import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import { env } from "./env";

export const cld = new Cloudinary({
  cloud: { cloudName: env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME },
  url: { secure: true },
});

export async function uploadAvatar(fileUri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    upload(cld, {
      file: fileUri,
      options: {
        upload_preset: env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        resource_type: "image",
        unsigned: true,
      },
      callback: (error, response) => {
        if (error || !response) {
          reject(error ?? new Error("Upload failed"));
        } else {
          resolve(response.secure_url);
        }
      },
    });
  });
}
