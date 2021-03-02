const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  // User ID to add users
  userID: {
    type: String,
    required: true,
    min: 8,
  },
  // Friends requests
  requests: [String],
  // Friends list
  friends: [String]
});

module.exports = mongoose.model("User", userSchema);
