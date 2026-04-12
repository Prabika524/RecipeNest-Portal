import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

export default function ChefProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`/api/chefs/${id}`),
      axios.get(`/api/recipes/chef/${id}`),
    ]).then(([c, r]) => { setChef(c.data); setRecipes(r.data); })
      .catch(() => navigate('/chefs'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!chef) return null;

  return (
    <div className="page">
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>← Back</button>

      {/* Chef hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-lighter) 0%, var(--surface-2) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
      }}>
        <img
          src={chef.profileImage || `https://i.pravatar.cc/120?u=${chef._id}`}
          alt={chef.name}
          style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--shadow)' }}
          onError={e => { e.target.src = `https://i.pravatar.cc/120?u=${chef._id}`; }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>{chef.name}</h1>
            <span className="badge badge-primary">Chef</span>
          </div>
          {chef.bio && <p style={{ color: 'var(--text-secondary)', maxWidth: 480 }}>{chef.bio}</p>}
          <div style={{ marginTop: '0.875rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            📅 Member since {new Date(chef.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)' }}>{recipes.length}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Recipes</div>
        </div>
      </div>

      <div className="page-header">
        <h2 className="page-title">Recipes by {chef.name}</h2>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <div className="empty-title">No recipes yet</div>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
        </div>
      )}
    </div>
  );
}
