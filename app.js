const express = require("express");
const path = require("path");
const multer = require("multer");

const app = express();

const UPLOADS_PATH = "./uploads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_PATH);
  },

  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const fileName =
      file.originalname
        .replace(extName, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();

    cb(null, fileName + extName);
  },
});

const uploads = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    console.log(file);
    if (file.fieldname === "avatar") {
      if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
      ) {
        cb(null, true);
      } else {
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    } else if (file.fieldname === "doc") {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        return cb(new Error("Only .pdf format allowed!"));
      }
    } else {
      return cb(new Error("Invalid field name!"));
    }
  },
});

app.post(
  "/",
  uploads.fields([
    { name: "avatar", maxCount: 1 },
    { name: "doc", maxCount: 1 },
  ]),
  (req, res) => {
    console.log(req.files);
    res.send("Post Successfully!");
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).send(err.message);
});

app.use((err, req, res, next) => {
  if (err) {
    res.statusCode(500).send(err.message);
  } else {
    res.send("File uploaded successfully");
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
