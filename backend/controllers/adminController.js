const mongoose = require("mongoose");
const Complaint = require("../models/Complaint");

exports.listComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);

    // whitelist filters: only known strings are ever put in the query
    const filter = {};
    if (typeof status === "string" && Complaint.STATUSES.includes(status)) {
      filter.status = status;
    }
    if (typeof category === "string" && Complaint.CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const [items, total] = await Promise.all([
      Complaint.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("user", "name email")
        .lean(),
      Complaint.countDocuments(filter),
    ]);

    res.json({ items, total, page, pages: Math.max(Math.ceil(total / limit), 1) });
  } catch (err) {
    console.error("List complaints error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStats = async (req, res) => {
  try {
    const rows = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const stats = { total: 0, submitted: 0, in_progress: 0, resolved: 0, rejected: 0 };
    rows.forEach((r) => {
      stats[r._id] = r.count;
      stats.total += r.count;
    });
    res.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Not found" });
    }

    const { status, adminNote } = req.body;
    if (typeof status !== "string" || !Complaint.STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const current = await Complaint.findById(id).select("status adminNote");
    if (!current) return res.status(404).json({ message: "Not found" });

    const note =
      typeof adminNote === "string" ? adminNote.trim().slice(0, 300) : current.adminNote;
    const changed = current.status !== status || note !== current.adminNote;

    const update = { $set: { status, adminNote: note } };
    // log the change so the citizen sees it on the Track Status timeline
    if (changed) update.$push = { statusHistory: { status, note, at: new Date() } };

    const complaint = await Complaint.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    })
      .select("-image.data")
      .populate("user", "name email")
      .lean();

    res.json({ complaint });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};