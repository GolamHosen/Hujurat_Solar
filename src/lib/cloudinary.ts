import { v2 as cloudinary } from "cloudinary";

/**
 * Configure and return Cloudinary instance.
 * Supports either CLOUDINARY_URL or discrete CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 */
export function isCloudinaryConfigured(): boolean {
  if (process.env.CLOUDINARY_URL) {
    return true;
  }
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function getCloudinaryClient() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({
      secure: true,
    });
  } else if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cloudinary;
}

export { cloudinary };
