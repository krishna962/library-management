const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const issueSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', issueSchema);
