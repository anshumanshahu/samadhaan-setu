require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// behind Render/Railway the real client IP comes from the proxy (needed for rate limits)
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",")
      : ["http://localhost:5173"],
  })
);
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => res.send("Samadhaan Setu backend is running"));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});