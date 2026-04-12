import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecipeFormModal from '../components/RecipeFormModal';

export default function ChefDashboard() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('recipes');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRecipe, setEditRecipe] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', profileImage: user?.profileImage || '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchRecipes = useCallback(() => {
    if (!user) return;
    setLoading(true);
    axios.get(`/api/recipes/chef/${user._id}`)
      .then(r => setRecipes(r.data))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { fetchRecipes(); }, [fetchRecipes]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && recipes.length > 0) {
      const recipe = recipes.find(r => r._id === editId);
      if (recipe) { setEditRecipe(recipe); setShowModal(true); }
    }
  }, [searchParams, recipes]);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, bio: user.bio || '', profileImage: user.profileImage || '' });
  }, [user]);

  const handleDelete = async id => {
    try { await axios.delete(`/api/recipes/${id}`); fetchRecipes(); setDeleteConfirm(null); }
    catch (err) { alert('Failed to delete recipe'); }
  };

  const handleSaveProfile = async e => {
    e.preventDefault(); setSaving(true);
    try { await updateProfile(profileForm); setSaveMsg('Profile updated!'); setTimeout(() => setSaveMsg(''), 2500); }
    catch (err) {} finally { setSaving(false); }
  };

  const totalViews = recipes.reduce((acc, r) => acc + (r.views || 0), 0);
  const avgRating = recipes.length > 0
    ? (recipes.reduce((acc, r) => acc + parseFloat(r.averageRating || 0), 0) / recipes.length).toFixed(1)
    : '—';

  const sidebarItems = [
    { key: 'recipes', icon: '📋', label: 'My Recipes' },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="page">
      {showModal && (
        <RecipeFormModal
          recipe={editRecipe}
          onClose={() => { setShowModal(false); setEditRecipe(null); }}
          onSaved={() => { setShowModal(false); setEditRecipe(null); fetchRecipes(); }}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 380, textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🗑️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>Delete Recipe?</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <h2 className="page-title">Chef Portal 👨‍🍳</h2>
        <p className="page-subtitle">Manage your recipes and profile</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Recipes</div>
          <div className="stat-value">{recipes.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Views</div>
          <div className="stat-value">{totalViews.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Rating</div>
          <div className="stat-value">{avgRating}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Reviews</div>
          <div className="stat-value">{recipes.reduce((acc, r) => acc + (r.reviews?.length || 0), 0)}</div>
        </div>
      </div>

      <div className="dashboard-layout">
        <aside className="sidebar">
          {sidebarItems.map(item => (
            <button key={item.key} className={`sidebar-item${tab === item.key ? ' active' : ''}`} onClick={() => setTab(item.key)}>
              <span className="icon">{item.icon}</span>{item.label}
            </button>
          ))}
          <button className="sidebar-item" onClick={() => navigate(`/chefs/${user?._id}`)}>
            <span className="icon">👁</span>Public Profile
          </button>
        </aside>

        <main>
          {tab === 'recipes' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem' }}>My Recipes</h3>
                <button className="btn btn-primary" onClick={() => { setEditRecipe(null); setShowModal(true); }}>
                  + Add Recipe
                </button>
              </div>
              {loading ? <div className="loading"><div className="spinner" /></div>
                : recipes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <div className="empty-title">No recipes yet</div>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowModal(true)}>Create your first recipe</button>
                  </div>
                ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Recipe</th>
                          <th>Category</th>
                          <th>Views</th>
                          <th>Rating</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recipes.map(recipe => (
                          <tr key={recipe._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img
                                  src={recipe.imageURL || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=60'}
                                  alt={recipe.title}
                                  style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=60'; }}
                                />
                                <div>
                                  <div style={{ fontWeight: 600 }}>{recipe.title}</div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{recipe.difficulty} · {recipe.cookTime}</div>
                                </div>
                              </div>
                            </td>
                            <td>{recipe.category?.name || '—'}</td>
                            <td>{recipe.views || 0}</td>
                            <td>
                              {recipe.averageRating > 0
                                ? <span style={{ color: '#F59E0B' }}>★ {recipe.averageRating}</span>
                                : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                            </td>
                            <td>
                              <span className={`badge ${recipe.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                {recipe.isPublished ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-outline btn-sm" onClick={() => navigate(`/recipes/${recipe._id}`)}>View</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => { setEditRecipe(recipe); setShowModal(true); }}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => setDeleteConfirm(recipe._id)}>Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </>
          )}

          {tab === 'profile' && (
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1.25rem' }}>Chef Profile</h3>
              {saveMsg && <div className="alert alert-success">{saveMsg}</div>}
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell visitors about your culinary style..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input className="form-input" value={profileForm.profileImage} onChange={e => setProfileForm({ ...profileForm, profileImage: e.target.value })} placeholder="https://..." />
                  {profileForm.profileImage && (
                    <img src={profileForm.profileImage} alt="Preview" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginTop: '0.5rem', border: '2px solid var(--border)' }} />
                  )}
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
