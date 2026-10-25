import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_pc4jxypuCtNpQcrWVi+vbNvRL+k=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_yxebzpypbld1Kv3xq0lF1+DCnO8=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/nrbbmx019"
});

export default imagekit;
