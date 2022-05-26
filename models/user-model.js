const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    subscribed: {
      type: Boolean,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("user", UserSchema);
