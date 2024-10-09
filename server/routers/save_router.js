const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/single", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.json({ message: `File uploaded successfully: ${req.file.path}` });
});

//multiple uploads
router.post("/multiple", upload.array("files", 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({message: "No files uploaded."});
  }
  const filePaths = req.files.map((file) => file.path);
  res.status(200).json({message: `Files uploaded successfully: ${filePaths.join(", ")}`});
});

module.exports = router;