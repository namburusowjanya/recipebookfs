const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Recipe = require("../models/Recipe");
const Search = require("../models/Search");
router.get("/", async (req, res) => {
  const recipes = await Recipe.find()
    .populate("createdBy", "username role")
    .populate("reviews.user", "username");
  res.json(recipes);
});
router.get("/my", auth, async (req, res) => {
  const recipes = await Recipe.find({ createdBy: req.user.id }).populate("reviews.user", "username");
  res.json(recipes);
});
router.get("/search", async (req, res) => {
  const q = req.query.q?.toLowerCase() || "";
  if (q) {
    const existing = await Search.findOne({ query: q });
    if (existing) {
      existing.count += 1;
      await existing.save();
    } else {
      await Search.create({ query: q });
    }
  }
  const recipes = await Recipe.find({
    $or: [
      { name: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ]
  }).populate("createdBy", "username role")
    .populate("reviews.user", "username");
  res.json(recipes);
});
router.get("/top-rated", async (req, res) => {
  const recipes = await Recipe.find()
    .populate("createdBy", "username")
    .populate("reviews.user", "username");
  const sorted = recipes
    .map(r => ({
      ...r.toObject(),
      avgRating:
        r.reviews.length > 0
          ? r.reviews.reduce((a, c) => a + c.rating, 0) / r.reviews.length
          : 0
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);
  res.json(sorted);
});
router.post("/", auth, async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      likes: [],
      reviews: [],
      createdBy: req.user.id,
    });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to add recipe" });
  }
});
router.post("/:id/like", auth, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  recipe.likes = recipe.likes || [];
  const index = recipe.likes.findIndex(
    id => id.toString() === req.user.id
  );
  if (index === -1) {
    recipe.likes.push(req.user.id);
  } else {
    recipe.likes.splice(index, 1);
  }
  await recipe.save();
  res.json(recipe);
});
router.post("/:id/review", auth, async (req, res) => {
  const { comment, rating } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe not found" });
  }
  recipe.reviews = recipe.reviews || [];
  const alreadyReviewed = recipe.reviews.find(
    r => r.user.toString() === req.user.id
  );
  if (alreadyReviewed) {
    return res.status(400).json({ message: "You already reviewed this recipe" });
  }
  recipe.reviews.push({
    user: req.user.id,
    comment,
    rating
  });
  await recipe.save();
  res.json(recipe);
});
router.put("/:id", auth, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ message: "Not found" });

  if (
    recipe.createdBy &&
    recipe.createdBy.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not Allowed" });
  }

  Object.assign(recipe, req.body);
  await recipe.save();
  res.json(recipe);
});

router.delete("/:id", auth, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ message: "Recipe Not found" });
  }
  if (
    req.user.role === "admin" ||
    (recipe.createdBy &&
      recipe.createdBy.toString() === req.user.id)
  ) {
    await recipe.deleteOne();
    return res.json({ message: "Recipe Deleted" });
  }
  return res.status(403).json({ message: "Not Allowed" });
});
module.exports = router;