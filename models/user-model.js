const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const User = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    recipes: { type: [String], required: false },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// User.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
//     expiresIn: "2 days",
//   });
//   user.tokens = user.tokens.concat({ token });
//   await user.save();
//   return token;
// };

module.exports = mongoose.model("users", User);
