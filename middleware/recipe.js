const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Recipe = require("../models/recipe-model");

const recipeAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const data = jwt.verify(token, "JWT_KEY");
    const recipe = await Recipe.findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (!recipe) {
      throw new Error();
    }
    if (recipe.createdBy != data._id) {
      res.status(401).send({ error: "Not authorized to perform this action" });
    } else {
      next();
    }
  } catch {
    res.status(400).json({ success: false, error: "Recipe not found" });
  }
};

module.exports = recipeAuth;
