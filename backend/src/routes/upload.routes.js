const express = require("express");
const upload = require("../middleware/upload.middleware");
const { uploadImages } = require("../controllers/upload.controller");
const { authGuard } = require("../middleware/auth.middleware");

const router = express.Router();

// Allow single file under 'image' or 'file', or multiple files under 'images'
router.post(
  "/",
  authGuard,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "file", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  (req, res, next) => {
    // Normalize into req.file or req.files
    if (req.files?.image?.[0]) req.file = req.files.image[0];
    else if (req.files?.file?.[0]) req.file = req.files.file[0];
    else if (req.files?.images) req.files = req.files.images;
    next();
  },
  uploadImages
);

module.exports = router;

