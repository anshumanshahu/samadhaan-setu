const express = require("express");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const {
  createComplaint,
  getImage,
  listMine,
} = require("../controllers/complaintController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB, one photo
});

// turns multer errors into a clean JSON message
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image is too large (max 5 MB)"
          : "Invalid upload";
      return res.status(400).json({ message });
    }
    next();
  });
};

// 15 complaints per hour per IP
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 15,
  message: { message: "Too many complaints submitted. Please try again later." },
});

router.post("/", protect, createLimiter, uploadImage, createComplaint);
router.get("/mine", protect, listMine);
router.get("/:id/image", protect, getImage);

module.exports = router;