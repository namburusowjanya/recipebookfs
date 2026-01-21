const Recipe = require("../models/Recipe");

exports.getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
};

exports.addRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add recipe" });
  }
};