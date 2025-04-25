const mongoose = require('mongoose');

const teaOrderSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teaType: { type: String, required: true },
  quantity: { type: Number, required: true },
  payment: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeaOrder', teaOrderSchema);
