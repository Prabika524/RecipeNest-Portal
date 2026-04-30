const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Recipe = require('./models/Recipe');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/recipenest';

const seed = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});

  
  await Category.deleteMany({});
  await Recipe.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@recipenest.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create chefs
  const chef1 = await User.create({
    name: 'Sarah Johnson',
    email: 'sarah@recipenest.com',
    password: 'chef123',
    role: 'chef',
    bio: 'Passionate about Italian cuisine and healthy cooking.',
    profileImage: 'https://i.pravatar.cc/150?img=47',
  });

  const chef2 = await User.create({
    name: 'Michael Chen',
    email: 'michael@recipenest.com',
    password: 'chef123',
    role: 'chef',
    bio: 'Asian fusion expert with 10 years of culinary experience.',
    profileImage: 'https://i.pravatar.cc/150?img=68',
  });

  // Create user
  const user = await User.create({
    name: 'Emily Rodriguez',
    email: 'emily@recipenest.com',
    password: 'user123',
    role: 'user',
  });

  // Create categories
  const categories = await Category.insertMany([
    { name: 'Breakfast', description: 'Morning meals', createdBy: admin._id },
    { name: 'Lunch', description: 'Midday meals', createdBy: admin._id },
    { name: 'Dinner', description: 'Evening meals', createdBy: admin._id },
    { name: 'Dessert', description: 'Sweet treats', createdBy: admin._id },
    { name: 'Vegan', description: 'Plant-based recipes', createdBy: admin._id },
    { name: 'Snacks', description: 'Quick bites', createdBy: admin._id },
    { name: 'Drinks', description: 'Beverages', createdBy: admin._id },
    { name: 'Quick Meals', description: 'Ready in under 30 min', createdBy: admin._id },
  ]);

  // Create recipes
  await Recipe.insertMany([
    {
      title: 'Classic Margherita Pizza',
      description: 'Fresh mozzarella, basil and San Marzano tomatoes on a crispy crust.',
      ingredients: ['2 cups flour', '1 tsp yeast', '1 cup tomato sauce', '200g fresh mozzarella', 'fresh basil', 'olive oil', 'salt'],
      instructions: 'Mix flour, yeast and water to form dough. Let rise 1 hour. Roll out, add sauce, cheese. Bake at 220°C for 12-15 mins. Top with fresh basil.',
      imageURL: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
      category: categories[2]._id,
      chef: chef1._id,
      cookTime: '30 mins',
      servings: 4,
      difficulty: 'Medium',
      views: 342,
      reviews: [{ user: user._id, rating: 5, comment: 'Perfect recipe!' }],
    },
    {
      title: 'Avocado Toast with Poached Egg',
      description: 'Creamy avocado on sourdough with a perfectly poached egg.',
      ingredients: ['2 slices sourdough', '1 ripe avocado', '2 eggs', 'lemon juice', 'chili flakes', 'salt', 'pepper'],
      instructions: 'Toast bread. Mash avocado with lemon, salt. Poach eggs 3 mins. Assemble and season.',
      imageURL: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600',
      category: categories[0]._id,
      chef: chef1._id,
      cookTime: '15 mins',
      servings: 2,
      difficulty: 'Easy',
      views: 218,
      reviews: [{ user: user._id, rating: 4, comment: 'Simple and delicious!' }],
    },
    {
      title: 'Chocolate Lava Cake',
      description: 'Decadent warm chocolate cake with a molten center.',
      ingredients: ['200g dark chocolate', '100g butter', '4 eggs', '100g sugar', '50g flour', 'cocoa powder'],
      instructions: 'Melt chocolate and butter. Whisk eggs and sugar. Combine. Add flour. Bake in ramekins at 200°C for 12 mins.',
      imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600',
      category: categories[3]._id,
      chef: chef2._id,
      cookTime: '25 mins',
      servings: 4,
      difficulty: 'Medium',
      views: 590,
      reviews: [{ user: user._id, rating: 5, comment: 'Absolutely divine!' }],
    },
    {
      title: 'Thai Green Curry',
      description: 'Aromatic coconut curry with vegetables and jasmine rice.',
      ingredients: ['2 cans coconut milk', '3 tbsp green curry paste', '400g tofu', 'bell peppers', 'bamboo shoots', 'basil', 'fish sauce', 'lime'],
      instructions: 'Fry curry paste. Add coconut milk. Simmer vegetables 10 mins. Season with fish sauce and lime.',
      imageURL: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600',
      category: categories[2]._id,
      chef: chef2._id,
      cookTime: '25 mins',
      servings: 4,
      difficulty: 'Medium',
      views: 477,
      reviews: [],
    },
    {
      title: 'Caesar Salad',
      description: 'Classic romaine salad with homemade dressing and croutons.',
      ingredients: ['1 romaine lettuce', '100g parmesan', '1 cup croutons', '2 tbsp mayo', '1 tsp dijon', 'worcestershire sauce', 'lemon', 'garlic'],
      instructions: 'Make dressing by mixing mayo, dijon, worcestershire, lemon and garlic. Toss with lettuce, cheese, croutons.',
      imageURL: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600',
      category: categories[1]._id,
      chef: chef1._id,
      cookTime: '15 mins',
      servings: 2,
      difficulty: 'Easy',
      views: 201,
      reviews: [],
    },
    {
      title: 'Vegan Buddha Bowl',
      description: 'Nutritious bowl with roasted veggies, quinoa and tahini dressing.',
      ingredients: ['1 cup quinoa', 'sweet potato', 'chickpeas', 'kale', 'avocado', 'tahini', 'lemon', 'garlic', 'olive oil'],
      instructions: 'Cook quinoa. Roast sweet potato and chickpeas. Massage kale. Assemble bowl. Drizzle tahini dressing.',
      imageURL: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=600',
      category: categories[4]._id,
      chef: chef2._id,
      cookTime: '40 mins',
      servings: 2,
      difficulty: 'Easy',
      views: 310,
      reviews: [],
    },
  ]);

  console.log('✅ Seed data created successfully');
  console.log('Admin: admin@recipenest.com / admin123');
  console.log('Chef 1: sarah@recipenest.com / chef123');
  console.log('Chef 2: michael@recipenest.com / chef123');
  console.log('User: emily@recipenest.com / user123');

  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
