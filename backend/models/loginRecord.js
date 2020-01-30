const mongoose = require('mongoose');

const loginRecordSchema = mongoose.Schema({
  ip: { type: String, required: true },
  time: { type: String, required: true }
});

module.exports = mongoose.model('loginRecord', loginRecordSchema);
