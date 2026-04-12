import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Stars({ rating, interactive, onRate }) {
  const [hover, setHover] = useState(0);
  const r = parseFloat(rating) || 0;
  return (
    <span className="stars" style={{ fontSize: interactive ? '1.5rem' : '1rem', cursor: interactive ? 'pointer' : 'default' }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          style={{ color: i <= (hover || Math.round(r)) ? '#F59E0B' : '#D1D5DB' }}
          onMouseEnter={() => interactive && setHover(i)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate && onRate(i)}
        >★</span>
      ))}
    </span>
  );
}

export default function RecipeDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookmarking, setBookmarking] = useState(false);

  useEffect(() => {
    axios.get(`/api/recipes/${id}`)
      .then(r => setRecipe(r.data))
      .catch(() => navigate('/recipes'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const isBookmarked = user?.bookmarks?.some(b => (b._id || b) === id);

  const handleBookmark = async () => {
    if (!user) { navigate('/login'); return; }
    setBookmarking(true);
    try {
      await axios.post(`/api/recipes/${id}/bookmark`);
      await refreshUser();
    } catch (err) {} finally { setBookmarking(false); }
  };

  const handleReview = async e => {
    e.preventDefault();
    if (!reviewForm.rating) { setError('Please select a rating'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await axios.post(`/api/recipes/${id}/reviews`, reviewForm);
      setRecipe(res.data);
      setReviewForm({ rating: 0, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!recipe) return null;

  const alreadyReviewed = recipe.reviews?.some(r => r.user?._id === user?._id);
  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];

  return (
    <div className="page" style={{ maxWidth: 860 }}>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>← Back</button>

      {/* Hero image */}
      <img
        src={recipe.imageURL || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'}
        alt={recipe.title}
        className="recipe-detail-img"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'; }}
      />

      <div className="recipe-detail-header">
        <div>
          {recipe.category && <span className="badge badge-primary" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{recipe.category.name}</span>}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 700, lineHeight: 1.2, marginBottom: '0.75rem' }}>{recipe.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '1rem' }}>{recipe.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={recipe.chef?.profileImage || `https://i.pravatar.cc/40?u=${recipe.chef?._id}`}
              alt={recipe.chef?.name}
              style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
              onError={e => { e.target.src = `https://i.pravatar.cc/40?u=${recipe.chef?._id}`; }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{recipe.chef?.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Chef</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          <button
            className={`btn ${isBookmarked ? 'btn-primary' : 'btn-outline'}`}
            onClick={handleBookmark}
            disabled={bookmarking}
          >
            {isBookmarked ? '🔖 Saved' : '🔖 Save'}
          </button>
          {user?.role === 'chef' && user._id === recipe.chef?._id && (
            <button className="btn btn-outline btn-sm" onClick={() => navigate(`/chef-dashboard?edit=${recipe._id}`)}>Edit Recipe</button>
          )}
        </div>
      </div>

      {/* Meta pills */}
      <div className="recipe-meta-pills">
        {recipe.cookTime && <span className="meta-pill">⏱ {recipe.cookTime}</span>}
        {recipe.servings && <span className="meta-pill">🍽️ {recipe.servings} servings</span>}
        {recipe.difficulty && <span className="meta-pill">📊 {recipe.difficulty}</span>}
        <span className="meta-pill">👁 {recipe.views} views</span>
        {recipe.averageRating > 0 && (
          <span className="meta-pill">★ {recipe.averageRating} ({recipe.reviews?.length} reviews)</span>
        )}
      </div>

      <hr className="divider" />

      {/* Ingredients */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1rem' }}>Ingredients</h2>
      <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '2rem' }}>
        {ingredients.map((ing, i) => (
          <li key={i} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 0.875rem', fontSize: '0.9rem', border: '1px solid var(--border-light)' }}>
            ✓ {ing}
          </li>
        ))}
      </ul>

      <hr className="divider" />

      {/* Instructions */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1rem' }}>Instructions</h2>
      <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '1.5rem', lineHeight: 1.8, color: 'var(--text-primary)', border: '1px solid var(--border-light)', marginBottom: '2rem' }}>
        {recipe.instructions}
      </div>

      <hr className="divider" />

      {/* Reviews */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1.5rem' }}>
        Reviews ({recipe.reviews?.length || 0})
      </h2>

      {recipe.reviews?.length === 0 && (
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>No reviews yet. Be the first!</p>
      )}

      {recipe.reviews?.map((rev, i) => (
        <div className="review-card" key={i}>
          <div className="review-header">
            <img
              src={rev.user?.profileImage || `https://i.pravatar.cc/32?u=${rev.user?._id}`}
              alt={rev.user?.name}
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
              onError={e => { e.target.src = `https://i.pravatar.cc/32?u=${rev.user?._id}`; }}
            />
            <span className="review-name">{rev.user?.name}</span>
            <Stars rating={rev.rating} />
            <span className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{rev.comment}</p>
        </div>
      ))}

      {/* Write a review */}
      {user && !alreadyReviewed && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: '1.5rem', marginTop: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '1rem' }}>Write a Review</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleReview}>
            <div className="form-group">
              <label className="form-label">Your Rating</label>
              <Stars rating={reviewForm.rating} interactive onRate={r => setReviewForm({ ...reviewForm, rating: r })} />
            </div>
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea
                className="form-input"
                placeholder="Share your experience..."
                value={reviewForm.comment}
                onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.875rem' }}>Sign in to leave a review</p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      )}
    </div>
  );
}
