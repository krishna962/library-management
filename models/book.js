const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    imageUrl: String,
});

// ✅ Prevent Overwriting Model
module.exports = mongoose.models.Book || mongoose.model("Book", BookSchema);
