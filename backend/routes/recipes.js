const express = require('express');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/recipes - browse all recipes
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    let query = { isPublished: true };
    if (category) query.category = category;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { averageRating: -1 };
    if (sort === 'views') sortOption = { views: -1 };

    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('chef', 'name profileImage')
      .populate('category', 'name')
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ recipes, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('chef', 'name profileImage bio')
      .populate('category', 'name')
      .populate('reviews.user', 'name profileImage');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.views += 1;
    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/recipes - chef creates recipe
router.post('/', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const recipe = await Recipe.create({ ...req.body, chef: req.user._id });
    const populated = await recipe.populate('chef', 'name profileImage');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/recipes/:id
router.put('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.chef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this recipe' });
    }
    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('chef', 'name profileImage')
      .populate('category', 'name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', protect, authorize('chef', 'admin'), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.chef.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }
    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/recipes/:id/reviews
router.post('/:id/reviews', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const alreadyReviewed = recipe.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) return res.status(400).json({ message: 'Already reviewed' });

    recipe.reviews.push({ user: req.user._id, rating: Number(rating), comment });
    await recipe.save();
    const updated = await Recipe.findById(req.params.id)
      .populate('reviews.user', 'name profileImage')
      .populate('chef', 'name profileImage')
      .populate('category', 'name');
    res.status(201).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/recipes/:id/bookmark
router.post('/:id/bookmark', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const recipeId = req.params.id;
    const idx = user.bookmarks.indexOf(recipeId);
    if (idx > -1) {
      user.bookmarks.splice(idx, 1);
    } else {
      user.bookmarks.push(recipeId);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/recipes/chef/:chefId
router.get('/chef/:chefId', async (req, res) => {
  try {
    const recipes = await Recipe.find({ chef: req.params.chefId, isPublished: true })
      .populate('category', 'name')
      .populate('chef', 'name profileImage bio')
      .sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
