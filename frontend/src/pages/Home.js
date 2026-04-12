import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/recipes?limit=6'),
      axios.get('/api/categories'),
    ]).then(([r, c]) => {
      setRecipes(r.data.recipes);
      setCategories(c.data);
    }).finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/recipes?search=${encodeURIComponent(search)}`);
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <h1 className="hero-title">
          Discover, Cook &amp; Share<br /><em>Delicious Recipes</em>
        </h1>
        <p className="hero-subtitle">
          Join thousands of food lovers exploring handcrafted recipes from passionate chefs around the world.
        </p>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes, ingredients..."
          />
          <button type="submit">Search</button>
        </form>
        <div className="category-pills">
          {categories.slice(0, 8).map(c => (
            <span
              key={c._id}
              className="category-pill"
              onClick={() => navigate(`/recipes?category=${c._id}`)}
            >
              {c.name}
            </span>
          ))}
        </div>
      </section>

      {/* Featured recipes */}
      <section className="page">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="page-title">Featured Recipes</h2>
            <p className="page-subtitle">Handpicked favourites from our chef community</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/recipes')}>View All →</button>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : (
          <div className="recipe-grid">
            {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
          </div>
        )}
      </section>

      {/* CTA strip */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: 'white',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '1rem' }}>
          Are you a Chef?
        </h2>
        <p style={{ opacity: 0.9, marginBottom: '1.75rem', maxWidth: 420, margin: '0 auto 1.75rem' }}>
          Share your culinary creations with a community of passionate food lovers.
        </p>
        <button
          className="btn btn-lg"
          style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}
          onClick={() => navigate('/register')}
        >
          Join as Chef 👨‍🍳
        </button>
      </section>
    </>
  );
}
