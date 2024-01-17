const mongoose = require("mongoose");

const EarnSchema = new mongoose.Schema({
  address: String,
  playtime: String,
  earn: String,
});

module.exports = mongoose.model("Earn", EarnSchema);