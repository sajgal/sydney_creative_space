import { createServerFn } from "@tanstack/react-start";
import { v2 as cloudinary } from "cloudinary";

export const getServerTime = createServerFn().handler(() => {
  // This runs only on the server
  return new Date().toISOString();
});

export const deleteImage = createServerFn().handler(async () => {
  cloudinary.config({
    cloud_name: process.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // cloudinary.api
  //   .resource('XUUoZkWwAIVSEYeYec9O/hoq3ma63jzfnyeekuakc')
  //   .catch(error => console.log('----- error', error))
  //   .then(result=>console.log(result));

  const result = await cloudinary.uploader
    .destroy("XUUoZkWwAIVSEYeYec9O/hoq3ma63jzfnyeekuakc")
    .catch((error) => error.message)
    .then((result) => result);

  // console.log("------------- deleting the image init ----------");

  return result;
});
