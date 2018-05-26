const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apiSchema = new Schema({
  url: String,
  shortcode: String,
  startDate : Date,
  lastSeenDate: Date,
  redirectCout: Number
});

module.exports = mongoose.model('api', apiSchema);