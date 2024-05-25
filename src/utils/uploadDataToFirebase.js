import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../config/firebase";

const uploadImageAndVideo = async (file, fileType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blobMedia = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", file, true);
        xhr.send(null);
      });

      let contentType;
      if (fileType === "image") {
        contentType = "image/jpeg";
      } else if (fileType === "video") {
        contentType = "video/mp4";
      } else {
        throw new Error("Invalid file type");
      }

      const metadata = {
        contentType: contentType,
      };

      const storageRef = ref(storage, `media/${fileType}/${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, blobMedia, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              break;
            case "storage/canceled":
              break;
            case "storage/unknown":
              break;
          }
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              console.log("Upload successful");
              resolve({ downloadUrl: downloadUrl });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              reject(error);
            });
        }
      );
    } catch (error) {
      console.error("Error uploading media:", error);
      reject(error);
    }
  });
};

export default uploadImageAndVideo;
