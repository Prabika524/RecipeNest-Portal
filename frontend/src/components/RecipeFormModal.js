import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RecipeFormModal({ recipe, onClose, onSaved }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', ingredients: '', instructions: '',
    imageURL: '', category: '', cookTime: '', servings: 4, difficulty: 'Medium', isPublished: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data));
    if (recipe) {
      setForm({
        title: recipe.title || '',
        description: recipe.description || '',
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
        instructions: recipe.instructions || '',
        imageURL: recipe.imageURL || '',
        category: recipe.category?._id || recipe.category || '',
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || 4,
        difficulty: recipe.difficulty || 'Medium',
        isPublished: recipe.isPublished !== false,
      });
    }
  }, [recipe]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = {
        ...form,
        ingredients: form.ingredients.split('\n').map(s => s.trim()).filter(Boolean),
        servings: Number(form.servings),
      };
      if (recipe) {
        await axios.put(`/api/recipes/${recipe._id}`, payload);
      } else {
        await axios.post('/api/recipes', payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save recipe');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input className="form-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Ingredients (one per line) *</label>
            <textarea className="form-input" style={{ minHeight: 120 }} value={form.ingredients} onChange={e => setForm({ ...form, ingredients: e.target.value })} placeholder="2 cups flour&#10;1 tsp salt&#10;..." required />
          </div>
          <div className="form-group">
            <label className="form-label">Instructions *</label>
            <textarea className="form-input" style={{ minHeight: 120 }} value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Image URL</label>
            <input className="form-input" value={form.imageURL} onChange={e => setForm({ ...form, imageURL: e.target.value })} placeholder="https://..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="">Select...</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cook Time</label>
              <input className="form-input" value={form.cookTime} onChange={e => setForm({ ...form, cookTime: e.target.value })} placeholder="e.g. 30 mins" />
            </div>
            <div className="form-group">
              <label className="form-label">Servings</label>
              <input type="number" className="form-input" value={form.servings} onChange={e => setForm({ ...form, servings: e.target.value })} min={1} />
            </div>
          </div>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
              <span className="form-label" style={{ margin: 0 }}>Published (visible to all users)</span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : recipe ? 'Save Changes' : 'Publish Recipe'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
