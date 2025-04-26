const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  name: String,
  exam: String,
  rank: String,
  year: Number,
  description: String,
  photo: String,   // image path
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
