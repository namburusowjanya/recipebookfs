const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const Recipe = require("../models/Recipe");
const Search = require("../models/Search");
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
};
router.get("/stats", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.countDocuments();
    const recipes = await Recipe.countDocuments();
    const allRecipes = await Recipe.find();
    let reviews = 0;
    let likes = 0;
    allRecipes.forEach(r => {
      reviews += r.reviews?.length || 0;
      likes += r.likes?.length || 0;
    });
    const topSearches = await Search.find()
      .sort({ count: -1 })
      .limit(5);
    res.json({
      users,recipes,reviews,likes,
      topSearches: topSearches || []
    });
  } catch (err) {
    res.status(500).json({ message: "Stats error" });
  }
});
module.exports = router;