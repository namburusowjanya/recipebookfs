const mongoose = require("mongoose");
const searchSchema = new mongoose.Schema({
  query: String,
  count: { type: Number, default: 1 }
});
module.exports = mongoose.model("Search", searchSchema);