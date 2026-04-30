# RecipeNest — University Assignment Viva README

## 1. Project Overview
RecipeNest is a full-stack MERN web application designed for recipe discovery, sharing, and management. It supports three user roles — regular users, chefs, and administrators — and demonstrates practical skills in React, Express, MongoDB, JWT authentication, and responsive UI design.

This project is developed as part of a university assignment for CIS051-2 Web Technologies & Platforms.

## 2. Key Objectives
- Build a modern web application using the MERN stack
- Implement role-based authentication and authorization
- Support CRUD operations for recipes and categories
- Enable user interaction through reviews, bookmarks, and chef profiles
- Provide an admin dashboard for platform monitoring and management

## 3. Technology Stack
- Frontend: React 18, React Router v6, Axios
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose ODM
- Authentication: JWT + bcryptjs
- Styling: Custom CSS with responsive design
- Dev tools: Nodemon, Create React App

## 4. Application Features

### User Features
- Browse and search published recipes
- Filter recipes by category
- View full recipe details with ingredients and instructions
- Rate and review recipes
- Save/bookmark favourite recipes
- Update user profile information

### Chef Features
- Create, edit, and delete own recipes
- Manage recipe visibility and metadata
- View chef dashboard with recipe statistics
- Public chef profile page

### Admin Features
- View overall analytics: users, recipes, views, ratings
- Manage users and roles
- Manage recipe categories

## 5. Project Structure

```
recipenest/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── seed.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        └── pages/
```

### Backend
- `models/`: Mongoose schemas for `User`, `Recipe`, `Category`
- `routes/`: API routes for authentication, recipes, categories, admin
- `middleware/auth.js`: protects endpoints and checks user roles
- `server.js`: Express setup, database connection, route mounting
- `seed.js`: initial data loader for testing

### Frontend
- `src/context/AuthContext.js`: handles authentication state
- `src/components`: reusable UI components like navigation, recipe cards, modals
- `src/pages`: page components for home, login, recipes, dashboards

## 6. Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB running locally or through a cloud URI

### Installation
1. Clone the repository
2. Install dependencies
   ```bash
   cd recipenest
   npm install --prefix backend
   npm install --prefix frontend
   ```
3. Configure environment variables
   ```bash
   cp backend/.env.example backend/.env
   ```
4. Seed the database
   ```bash
   cd backend
   node seed.js
   ```
5. Run the application
   - Backend: `npm run dev --prefix backend`
   - Frontend: `npm start --prefix frontend`

Open the frontend at `http://localhost:3000`.

## 7. Demo Accounts
Use seeded credentials for testing:
- Admin: `admin@recipenest.com` / `admin123`
- Chef: `sarah@recipenest.com` / `chef123`
- Chef: `michael@recipenest.com` / `chef123`
- User: `emily@recipenest.com` / `user123`

## 8. Important Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Recipes
- `GET /api/recipes`
- `GET /api/recipes/:id`
- `POST /api/recipes`
- `PUT /api/recipes/:id`
- `DELETE /api/recipes/:id`
- `POST /api/recipes/:id/reviews`
- `POST /api/recipes/:id/bookmark`

### Categories
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Admin
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `DELETE /api/admin/users/:id`

## 9. Database Schema Summary

### User
- `name`, `email`, `password`, `role`, `bio`, `profileImage`, `bookmarks`

### Recipe
- `title`, `description`, `ingredients`, `instructions`, `imageURL`
- `category`, `chef`, `reviews`, `cookTime`, `servings`, `difficulty`, `isPublished`, `views`

### Review
- `user`, `rating`, `comment`, timestamps

### Category
- `name`, `description`, `createdBy`

## 10. Viva Talking Points
- Explain the MERN architecture and how frontend/backed are separated
- Describe JWT authentication flow and role-based access control
- Discuss schema design for recipes, reviews, and categories
- Show how React Router enables page navigation
- Highlight CRUD operations: recipe creation, editing, deletion
- Mention responsive UI and polished landing page design
- Point out admin analytics as an example of platform management

## 11. Future Enhancements
- Add user following / social interactions
- Enable file uploads for recipe images
- Add pagination and more advanced search filters
- Improve dashboard charts and analytics visuals
- Add email verification and password reset flow

## 12. Notes for Evaluation
- This project demonstrates a complete full-stack web app
- Clear separation of concerns: UI, API, data layer
- Role-based security with protected routes
- Usable and extensible architecture for future enhancements
- Functional user flows across regular users, chefs, and admin

---

## Design Decisions

- **Embedded reviews** in Recipe documents – avoids extra collection for a bounded dataset
- **Bookmark as array on User** – simple reference list, populated on demand
- **JWT stored in localStorage** – stateless authentication, 30-day expiry
- **Role-based middleware** – `protect` verifies token, `authorize(...roles)` checks permissions
- **React proxy** – `"proxy": "http://localhost:5000"` in frontend/package.json eliminates CORS during development

---

## References

- React Documentation – https://react.dev
- Express.js – https://expressjs.com
- Mongoose ODM – https://mongoosejs.com
- MongoDB – https://www.mongodb.com
- MDN Web Docs – https://developer.mozilla.org
- JWT – https://jwt.io
