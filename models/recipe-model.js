const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Recipe = new Schema(
  {
    name: { type: String, required: true },
    cookTime: { type: String, required: true },
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    description: { type: String, required: false },
    picture: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("recipes", Recipe);
