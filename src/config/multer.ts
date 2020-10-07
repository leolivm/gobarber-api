import path from "path";
import crypto from "crypto";
import multer from "multer";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  tmpFolder: tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, "uploads"),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(req, file, cb) {
      const hash = crypto.randomBytes(10).toString("hex");
      const fileName = `${hash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
