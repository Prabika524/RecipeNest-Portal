import React from 'react';
import { useNavigate } from 'react-router-dom';

function Stars({ rating }) {
  const r = parseFloat(rating) || 0;
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i}>{i <= Math.round(r) ? '★' : '☆'}</span>
      ))}
      {r > 0 && <span style={{ color: '#78716C', marginLeft: '3px' }}>{r}</span>}
    </span>
  );
}

export default function RecipeCard({ recipe }) {
  const navigate = useNavigate();
  return (
    <div className="card recipe-card" onClick={() => navigate(`/recipes/${recipe._id}`)}>
      <img
        src={recipe.imageURL || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'}
        alt={recipe.title}
        className="recipe-card-img"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600'; }}
      />
      <div className="recipe-card-body">
        {recipe.category && <div className="recipe-card-category">{recipe.category.name}</div>}
        <div className="recipe-card-title">{recipe.title}</div>
        <div className="recipe-card-desc">{recipe.description}</div>
        <div className="recipe-card-meta">
          <div className="recipe-card-chef">
            <img
              src={recipe.chef?.profileImage || `https://i.pravatar.cc/30?u=${recipe.chef?._id}`}
              alt={recipe.chef?.name}
              className="avatar-xs"
              onError={e => { e.target.src = `https://i.pravatar.cc/30?u=${recipe.chef?._id}`; }}
            />
            <span>{recipe.chef?.name}</span>
          </div>
          <Stars rating={recipe.averageRating} />
          {recipe.cookTime && <span>⏱ {recipe.cookTime}</span>}
        </div>
      </div>
    </div>
  );
}
