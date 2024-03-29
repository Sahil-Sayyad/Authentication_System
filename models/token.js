//import required packages
const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
},
  {
    timestamps: true,
  }
);
const Token = mongoose.model("Token", tokenSchema);
module.exports = Token;
