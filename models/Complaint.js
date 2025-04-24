const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    reply: String,
    adminReplyBy: String
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
