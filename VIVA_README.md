# RecipeNest — Viva Presentation Guide

## 1. Project Summary
RecipeNest is a full-stack MERN web application built for a university assignment. It allows users to discover, save, and review recipes while enabling chefs to publish and manage their own recipe content. The system also includes an admin interface for platform oversight.

## 2. Purpose of the Project
- Demonstrate practical knowledge of the MERN stack
- Build a working web application with authentication and authorization
- Show understanding of role-based access control
- Implement CRUD operations and relational data using MongoDB
- Develop a responsive user interface with React

## 3. Main Technologies
- Frontend: React 18, React Router v6, Axios
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Styling: Custom CSS

## 4. User Roles and Responsibilities

### Regular User
- Search and browse published recipes
- View recipe details, ingredients, instructions, and ratings
- Add reviews and rate recipes
- Bookmark favourite recipes
- Edit personal profile

### Chef
- All regular user abilities
- Create new recipes with title, category, ingredients, instructions, image, difficulty, servings, and cook time
- Edit and delete own recipes
- View dashboard metrics for authored recipes
- Maintain a public chef profile page

### Admin
- View platform statistics and analytics
- Manage categories
- Manage users and roles
- Oversee content across the system

## 5. Key App Pages
- **Home**: landing page with featured recipes and category exploration
- **Recipes**: browse recipes with search and filter functionality
- **RecipeDetail**: detailed recipe view with reviews
- **Login / Register**: authentication pages
- **UserDashboard**: profile, bookmarks, saved recipes
- **ChefDashboard**: recipe management and chef stats
- **AdminDashboard**: analytics and management tools

## 6. Setup Instructions
1. Open the project folder in terminal
2. Install dependencies
   ```bash
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. Create backend environment config
   ```bash
   cp backend/.env.example backend/.env
   ```
4. Seed database
   ```bash
   cd backend
   node seed.js
   ```
5. Run backend and frontend
   - Backend: `npm run dev --prefix backend`
   - Frontend: `npm start --prefix frontend`

## 7. Test Accounts
- Admin: `admin@recipenest.com` / `admin123`
- Chef: `sarah@recipenest.com` / `chef123`
- Chef: `michael@recipenest.com` / `chef123`
- User: `emily@recipenest.com` / `user123`

## 8. Important API Routes
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/recipes`
- `GET /api/recipes/:id`
- `POST /api/recipes`
- `PUT /api/recipes/:id`
- `POST /api/recipes/:id/reviews`
- `GET /api/categories`
- `GET /api/admin/analytics`

## 9. Viva Talking Points
- Explain how React and Express communicate through the API
- Describe the role of JWT in authentication
- Highlight the recipe review flow and data relationship
- Discuss how role-based access control is enforced in middleware
- Mention the responsive UI and background image enhancements
- Share ideas for future improvements

## 10. Future Enhancements
- Add image upload support for recipes
- Add social features like follows and comments
- Add search pagination and advanced filters
- Add password reset and email confirmation
- Add interactive analytics charts for admin

## 11. Notes for Presentation
- Focus on architecture first: frontend, backend, database
- Demonstrate a sample recipe creation and review process
- Highlight security and user differentiation
- Keep explanations brief and use the app flow as your guide
