const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Not authorized" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Session expired, please log in again" });
  }
};

// role is read from the database on every request, never from the token
exports.adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ message: "Admin access only" });
};