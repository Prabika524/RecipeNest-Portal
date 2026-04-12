# 🍳 RecipeNest – ChefPortal

A full-stack MERN web application for discovering, sharing, and managing recipes. Built for the CIS051-2 Web Technologies & Platforms assignment.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Styling | Custom CSS (light orange theme, Google Fonts) |

---

## Project Structure

```
recipenest/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (user/chef/admin roles)
│   │   ├── Recipe.js        # Recipe schema with embedded reviews
│   │   └── Category.js      # Recipe category schema
│   ├── routes/
│   │   ├── auth.js          # Register, login, profile
│   │   ├── recipes.js       # CRUD recipes, reviews, bookmarks
│   │   ├── categories.js    # Category management
│   │   └── admin.js         # Admin: users, analytics
│   ├── middleware/
│   │   └── auth.js          # protect + authorize middleware
│   ├── server.js            # Express app + MongoDB connection
│   ├── seed.js              # Seed data script
│   └── .env.example         # Environment variable template
│
└── frontend/
    └── src/
        ├── context/
        │   └── AuthContext.js       # Global auth state
        ├── components/
        │   ├── Navbar.js            # Sticky navigation bar
        │   ├── RecipeCard.js        # Recipe grid card
        │   └── RecipeFormModal.js   # Create/edit recipe modal
        └── pages/
            ├── Home.js              # Landing page + hero
            ├── Login.js             # Sign in page
            ├── Register.js          # Join us / sign up page
            ├── Recipes.js           # Browse + search + filter
            ├── RecipeDetail.js      # Full recipe + reviews
            ├── Chefs.js             # Chef directory
            ├── ChefProfile.js       # Public chef profile
            ├── UserDashboard.js     # User: bookmarks + profile
            ├── ChefDashboard.js     # Chef portal: recipes + stats
            └── AdminDashboard.js    # Admin: analytics, users, categories
```

---

## Prerequisites

- **Node.js** v18+
- **MongoDB** running locally on `mongodb://localhost:27017` (or supply a MongoDB Atlas URI)
- **npm** v9+

Install MongoDB Community Edition: https://www.mongodb.com/try/download/community

---

## Quick Start

### 1. Clone / unzip the project

```bash
cd recipenest
```

### 2. Set up environment variables

```bash
cp backend/.env.example backend/.env
# Edit backend/.env if needed (change MONGODB_URI or JWT_SECRET)
```

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Seed the database

```bash
# From the backend folder
cd backend
node seed.js
```

This creates:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recipenest.com | admin123 |
| Chef | sarah@recipenest.com | chef123 |
| Chef | michael@recipenest.com | chef123 |
| User | emily@recipenest.com | user123 |

### 5. Start the servers

**Terminal 1 – Backend**
```bash
cd backend
npm run dev        # runs on http://localhost:5000
```

**Terminal 2 – Frontend**
```bash
cd frontend
npm start          # runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Features by Role

### 👤 Food Lover (User)
- Browse and search all published recipes
- Filter by category, sort by newest / most viewed / top rated
- View full recipe details (ingredients, instructions, cook time)
- Rate and review recipes
- Bookmark / save favourite recipes
- Edit personal profile

### 👨‍🍳 Chef
- All user features
- **Chef Portal** dashboard with stats (recipe count, views, avg rating)
- Create, edit, delete own recipes
- Manage recipe details: title, description, ingredients, instructions, image, category, difficulty, cook time, servings, publish status
- View public chef profile page

### ⚙️ Admin
- Platform analytics (total users, recipes, views, reviews)
- Full user management (search, change roles, delete users)
- Recipe category management (add, edit, delete)
- View recent recipe activity

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | List recipes (search, filter, paginate) |
| GET | /api/recipes/:id | Get single recipe |
| POST | /api/recipes | Create recipe (chef/admin) |
| PUT | /api/recipes/:id | Update recipe |
| DELETE | /api/recipes/:id | Delete recipe |
| POST | /api/recipes/:id/reviews | Add review |
| POST | /api/recipes/:id/bookmark | Toggle bookmark |
| GET | /api/recipes/chef/:chefId | Recipes by chef |

### Categories
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | /api/categories | Public |
| POST | /api/categories | Admin |
| PUT | /api/categories/:id | Admin |
| DELETE | /api/categories/:id | Admin |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/analytics | Platform stats |
| GET | /api/admin/users | List all users |
| PUT | /api/admin/users/:id | Update user role |
| DELETE | /api/admin/users/:id | Delete user |

---

## Database Schema

### User
```
_id, name, email, password (hashed), role (user|chef|admin),
bio, profileImage, bookmarks[], createdAt, updatedAt
```

### Recipe
```
_id, title, description, ingredients[], instructions, imageURL,
category (ref), chef (ref), reviews[], cookTime, servings,
difficulty, isPublished, views, createdAt, updatedAt
```

### Review (embedded in Recipe)
```
user (ref), rating (1-5), comment, createdAt
```

### Category
```
_id, name, description, createdBy (ref), createdAt
```

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
