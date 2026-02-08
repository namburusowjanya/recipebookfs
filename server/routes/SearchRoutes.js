const express = require("express");
const router = express.Router();
const Search = require("../models/Search");
router.post("/", async (req, res) => {
  const { query } = req.body;
  if (!query) return res.sendStatus(400);
  const existing = await Search.findOne({ query });
  if (existing) {
    existing.count += 1;
    await existing.save();
  } else {
    await Search.create({ query });
  }
  res.json({ success: true });
});
module.exports = router;