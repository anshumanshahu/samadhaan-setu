// Usage: node scripts/makeAdmin.js user@email.com
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

(async () => {
  const email = process.argv[2];
  if (!email) {
    console.log("Usage: node scripts/makeAdmin.js user@email.com");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { role: "admin" },
    { new: true }
  );
  console.log(user ? `${user.email} is now an admin` : "No user found with that email");
  await mongoose.disconnect();
})();