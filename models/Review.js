// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     reviewText: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now }
// });

// const Review = mongoose.model("Review", reviewSchema);

// module.exports = Review;

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    review: { type: String, required: true },
    // date: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
