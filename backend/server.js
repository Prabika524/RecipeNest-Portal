const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/admin', require('./routes/admin'));

// Chefs public list
app.get('/api/chefs', async (req, res) => {
  try {
    const User = require('./models/User');
    const Recipe = require('./models/Recipe');
    const chefs = await User.find({ role: 'chef' }).select('-password');
    const chefsWithCount = await Promise.all(
      chefs.map(async (chef) => {
        const count = await Recipe.countDocuments({ chef: chef._id });
        return { ...chef.toJSON(), recipeCount: count };
      })
    );
    res.json(chefsWithCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Chef profile public
app.get('/api/chefs/:id', async (req, res) => {
  try {
    const User = require('./models/User');
    const chef = await User.findById(req.params.id).select('-password');
    if (!chef || chef.role !== 'chef') return res.status(404).json({ message: 'Chef not found' });
    res.json(chef);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipenest';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
