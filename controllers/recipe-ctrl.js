const Recipe = require("../models/recipe-model");
const mongoose = require("mongoose");

addRecipe = async (req, res) => {
  const body = req.body;
  if (!body.name || !body.cookTime || !body.ingredients || !body.steps) {
    return res.status(400).json("incorrect form submission");
  }

  const recipe = new Recipe({
    name: body.name,
    cookTime: body.cookTime,
    ingredients: body.ingredients,
    steps: body.steps,
    description: body.description,
    picture: body.picture,
  });

  if (!recipe) {
    return res.status(400).json({ success: false, error: err });
  }

  recipe
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: recipe._id,
        message: "Recipe created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Recipe not created",
      });
    });
};

getRecipes = async (req, res) => {
  await Recipe.find({}, (err, recipes) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!recipes.length) {
      return res
        .status(404)
        .json({ success: false, error: "Recipes not found" });
    }
    return res.status(200).json({ success: true, data: recipes });
  }).catch((err) => console.log(err));
};

getRecipe = async (req, res) => {
  await Recipe.findOne(
    { _id: mongoose.Types.ObjectId(req.params.id) },
    (err, recipe) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      if (!recipe) {
        return res
          .status(404)
          .json({ success: false, error: "Recipe not found" });
      }
      return res.status(200).json({ success: true, data: recipe });
    }
  ).catch((err) => console.log(err));
};

module.exports = { addRecipe, getRecipes, getRecipe };
