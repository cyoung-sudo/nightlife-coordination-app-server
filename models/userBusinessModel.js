const mongoose = require("mongoose");

const UserBusinessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  businessId: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("UserBusiness", UserBusinessSchema);