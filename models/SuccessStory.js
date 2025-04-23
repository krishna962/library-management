const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    testimonial: { type: String, required: true },
    userClass: { type: String, required: true },  // Added user class for consistency
    photo: { type: String, default: '/images/default-user.png' },
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
