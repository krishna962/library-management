const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, // e.g. "April 2025"
  amount: { type: Number, required: true },
  paidAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeePayment', feePaymentSchema);
