// cloudinaryUpload.ts

import axios from "axios";

const CLOUD_NAME = "dlz7oiktg";
const UPLOAD_PRESET = "task_upload";

// Simple MIME type lookup based on file extension
const getMimeType = (fileUri: string): string => {
  const ext = fileUri.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'bmp':
      return 'image/bmp';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
};

export const uploadToCloudinary = async (fileUri: string): Promise<string> => {
  const mimeType = getMimeType(fileUri);
  const fileExtension = fileUri.split(".").pop() || "file";

  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    type: mimeType,
    name: `task-image.${fileExtension}`,
  } as any);

  formData.append("upload_preset", UPLOAD_PRESET);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.secure_url;
};
