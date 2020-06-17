const mongoose = require("mongoose");
const monSchema = mongoose.Schema;
const userSchema = monSchema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

User = mongoose.model("users", userSchema);
module.exports = User;
