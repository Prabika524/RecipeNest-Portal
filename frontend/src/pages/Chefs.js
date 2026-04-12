import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/chefs')
      .then(r => setChefs(r.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Our Chefs</h2>
        <p className="page-subtitle">Discover talented chefs sharing their culinary expertise</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : chefs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👨‍🍳</div>
          <div className="empty-title">No chefs yet</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {chefs.map(chef => (
            <div key={chef._id} className="chef-card" onClick={() => navigate(`/chefs/${chef._id}`)}>
              <img
                src={chef.profileImage || `https://i.pravatar.cc/100?u=${chef._id}`}
                alt={chef.name}
                className="chef-avatar"
                onError={e => { e.target.src = `https://i.pravatar.cc/100?u=${chef._id}`; }}
              />
              <div className="chef-name">{chef.name}</div>
              <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.375rem' }}>
                {chef.recipeCount} recipe{chef.recipeCount !== 1 ? 's' : ''}
              </div>
              {chef.bio && <div className="chef-bio">{chef.bio}</div>}
              <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }}>View Recipes →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
