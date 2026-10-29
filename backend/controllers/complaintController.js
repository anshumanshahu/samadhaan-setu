const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");
const { classifyBuffer } = require("../services/mlService");

// Look at the real file bytes, not the name/type the browser claims
function detectImageType(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (
    buf.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    )
  ) {
    return "image/png";
  }
  if (
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

const toNumber = (v) =>
  typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
const cleanText = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

exports.createComplaint = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "A photo is required" });
    }

    const contentType = detectImageType(req.file.buffer);
    if (!contentType) {
      return res
        .status(400)
        .json({ message: "Only JPEG, PNG or WebP images are allowed" });
    }

    const lat = toNumber(req.body.latitude);
    const lng = toNumber(req.body.longitude);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      Math.abs(lat) > 90 ||
      Math.abs(lng) > 180
    ) {
      return res.status(400).json({ message: "A valid location is required" });
    }
    const accuracy = toNumber(req.body.accuracy);

    // verify the photo on the server
    let ai;
    try {
      ai = await classifyBuffer(req.file.buffer, contentType);
    } catch (err) {
      console.error("ML service error:", err.message);
      return res.status(503).json({
        message: "AI service is unavailable right now. Please try again shortly.",
      });
    }

    if (ai.category === "unknown" || ai.is_uncertain) {
      return res.status(422).json({
        message:
          "This photo does not clearly show a garbage, pothole, manhole or water leak issue.",
      });
    }
    if (!Complaint.CATEGORIES.includes(ai.category)) {
      return res.status(502).json({ message: "Unexpected response from AI service" });
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      category: ai.category,
      aiConfidence: ai.confidence,
      description: cleanText(req.body.description, 500),
      location: { type: "Point", coordinates: [lng, lat] },
      address: cleanText(req.body.address, 300),
      city: cleanText(req.body.city, 80),
      accuracy: Number.isFinite(accuracy) ? Math.round(accuracy) : undefined,
      image: { data: req.file.buffer, contentType },
      statusHistory: [{ status: "submitted" }],
    });

    res.status(201).json({
      id: complaint._id,
      category: complaint.category,
      status: complaint.status,
    });
  } catch (err) {
    console.error("Create complaint error:", err);
    res.status(500).json({ message: "Server error, please try again" });
  }
};

// Image is private: only the person who reported it, or an admin
exports.getImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Not found" });
    }

    const complaint = await Complaint.findById(id).select("+image.data");
    if (!complaint || !complaint.image?.data) {
      return res.status(404).json({ message: "Not found" });
    }

    const isOwner = complaint.user.equals(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    res.set({
      "Content-Type": complaint.image.contentType,
      "Cache-Control": "private, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    });
    res.send(complaint.image.data);
  } catch (err) {
    console.error("Get image error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// The logged-in user's own complaints (no photo data, photos load separately)
exports.listMine = async (req, res) => {
  try {
    const items = await Complaint.find({ user: req.user._id })
      .select("-image")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ items });
  } catch (err) {
    console.error("List mine error:", err);
    res.status(500).json({ message: "Server error" });
  }
};