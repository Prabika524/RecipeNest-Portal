const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/admin/users - list all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id - update user role
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/analytics
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecipes = await Recipe.countDocuments();
    const totalViews = await Recipe.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
    const totalReviews = await Recipe.aggregate([{ $project: { count: { $size: '$reviews' } } }, { $group: { _id: null, total: { $sum: '$count' } } }]);
    const chefs = await User.countDocuments({ role: 'chef' });
    const recentRecipes = await Recipe.find().sort({ createdAt: -1 }).limit(5)
      .populate('chef', 'name')
      .populate('category', 'name');

    res.json({
      totalUsers,
      totalRecipes,
      totalViews: totalViews[0]?.total || 0,
      totalReviews: totalReviews[0]?.total || 0,
      chefs,
      recentRecipes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/chefs
router.get('/chefs', protect, authorize('admin'), async (req, res) => {
  try {
    const chefs = await User.find({ role: 'chef' }).select('-password');
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
