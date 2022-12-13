const mongoose = require("mongoose");

const UserSearchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  term: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  open: {
    type: Boolean,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("UserSearch", UserSearchSchema);