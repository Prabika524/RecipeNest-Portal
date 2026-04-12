import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/RecipeCard';

export default function UserDashboard() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookmarks');
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', profileImage: user?.profileImage || '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (tab === 'bookmarks' && user?.bookmarks?.length > 0) {
      setLoading(true);
      Promise.all(user.bookmarks.map(id => axios.get(`/api/recipes/${id._id || id}`).catch(() => null)))
        .then(results => setBookmarks(results.filter(Boolean).map(r => r.data)))
        .finally(() => setLoading(false));
    }
  }, [tab, user?.bookmarks]);

  useEffect(() => {
    if (user) setProfileForm({ name: user.name, bio: user.bio || '', profileImage: user.profileImage || '' });
  }, [user]);

  const handleSaveProfile = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      setSaveMsg('Profile updated!');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch (err) {} finally { setSaving(false); }
  };

  const sidebarItems = [
    { key: 'bookmarks', icon: '🔖', label: 'Saved Recipes' },
    { key: 'profile', icon: '👤', label: 'My Profile' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Welcome, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="page-subtitle">Your personal recipe dashboard</p>
      </div>
      <div className="dashboard-layout">
        <aside className="sidebar">
          {sidebarItems.map(item => (
            <button key={item.key} className={`sidebar-item${tab === item.key ? ' active' : ''}`} onClick={() => setTab(item.key)}>
              <span className="icon">{item.icon}</span> {item.label}
            </button>
          ))}
        </aside>

        <main>
          {tab === 'bookmarks' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1.25rem' }}>Saved Recipes</h3>
              {loading ? <div className="loading"><div className="spinner" /></div>
                : bookmarks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔖</div>
                    <div className="empty-title">No saved recipes yet</div>
                    <p>Browse recipes and save your favourites!</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/recipes')}>Browse Recipes</button>
                  </div>
                ) : (
                  <div className="recipe-grid">
                    {bookmarks.map(r => <RecipeCard key={r._id} recipe={r} />)}
                  </div>
                )}
            </div>
          )}

          {tab === 'profile' && (
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1.25rem' }}>My Profile</h3>
              {saveMsg && <div className="alert alert-success">{saveMsg}</div>}
              <form onSubmit={handleSaveProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })} placeholder="Tell us about yourself..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Profile Image URL</label>
                  <input className="form-input" value={profileForm.profileImage} onChange={e => setProfileForm({ ...profileForm, profileImage: e.target.value })} placeholder="https://..." />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
              </form>
              <hr className="divider" />
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <p><strong>Email:</strong> {user?.email}</p>
                <p style={{ marginTop: '0.375rem' }}><strong>Role:</strong> {user?.role}</p>
                <p style={{ marginTop: '0.375rem' }}><strong>Member since:</strong> {new Date(user?.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
