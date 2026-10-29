const express = require("express");
const {
  listComplaints,
  getStats,
  updateStatus,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// every route below needs a logged-in admin
router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/complaints", listComplaints);
router.patch("/complaints/:id/status", updateStatus);

module.exports = router;