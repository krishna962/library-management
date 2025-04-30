const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  imageUrl: String,
  description: String, // Optional: short book description
  available: { type: Boolean, default: true }, // For status display
  issuedCount: { type: Number, default: 0 },   // How many times issued
}, {
  timestamps: true
});

// ✅ Prevent Overwriting Model
module.exports = mongoose.models.Book || mongoose.model("Book", BookSchema);
