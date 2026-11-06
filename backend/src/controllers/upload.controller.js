/**
 * Handles single or multiple image uploads and returns accessible URLs.
 */
function uploadImages(req, res) {
  if (!req.file && (!req.files || req.files.length === 0)) {
    return res.status(400).json({
      success: false,
      message: "No image file provided for upload.",
    });
  }

  const host = `${req.protocol}://${req.get("host")}`;

  if (req.file) {
    const fileUrl = `${host}/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  }

  const uploadedFiles = req.files.map((file) => ({
    url: `${host}/uploads/${file.filename}`,
    filename: file.filename,
    originalName: file.originalname,
    size: file.size,
  }));

  return res.json({
    success: true,
    message: `${uploadedFiles.length} image(s) uploaded successfully.`,
    data: uploadedFiles,
  });
}

module.exports = {
  uploadImages,
};

