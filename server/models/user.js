const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, unique: true },
  // friends: { type: String, required: true },
  requests: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  friends: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
