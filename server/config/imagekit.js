import "./env.js";
import ImageKit from "imagekit";

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY || "";
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || "";
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT || "";

let imagekit = null;

if (publicKey && privateKey && urlEndpoint) {
  try {
    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
  } catch (err) {
    console.error("Failed to initialize ImageKit client:", err.message);
  }
} else {
  console.warn("⚠️ ImageKit environment variables not set in .env. Image uploads will require IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT.");
}

export default imagekit;
