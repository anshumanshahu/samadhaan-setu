const mongoose = require("mongoose");

const CATEGORIES = ["garbage", "pothole", "manhole", "water_leak"];
const STATUSES = ["submitted", "in_progress", "resolved", "rejected"];

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: { type: String, enum: CATEGORIES, required: true },
    aiConfidence: { type: Number, required: true }, // 0-100, from the ML model
    description: { type: String, trim: true, maxlength: 500, default: "" },

    // GeoJSON point: coordinates are [longitude, latitude]
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, trim: true, maxlength: 300, default: "" },
    city: { type: String, trim: true, maxlength: 80, default: "" },
    accuracy: { type: Number }, // GPS accuracy in meters

    // photo stored in MongoDB; select:false keeps it out of normal queries
    image: {
      data: { type: Buffer, select: false },
      contentType: { type: String },
    },

    status: { type: String, enum: STATUSES, default: "submitted", index: true },
    adminNote: { type: String, trim: true, maxlength: 300, default: "" },

    // every status change; shown as a timeline on the Track Status page
    statusHistory: [
      {
        _id: false,
        status: { type: String, enum: STATUSES },
        note: { type: String, trim: true, maxlength: 300, default: "" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

complaintSchema.index({ location: "2dsphere" });
complaintSchema.index({ createdAt: -1 });

const Complaint = mongoose.model("Complaint", complaintSchema);
Complaint.CATEGORIES = CATEGORIES;
Complaint.STATUSES = STATUSES;

module.exports = Complaint;