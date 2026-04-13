const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  imageURL: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviews: { type: [reviewSchema], default: [] },
  cookTime: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
}, { timestamps: true });

recipeSchema.virtual('averageRating').get(function () {
  if (!this.reviews || this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

recipeSchema.set('toJSON', { virtuals: true });
recipeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);
