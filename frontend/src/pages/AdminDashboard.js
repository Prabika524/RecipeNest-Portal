import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editCat, setEditCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const fetchAnalytics = useCallback(() => {
    axios.get('/api/admin/analytics').then(r => setAnalytics(r.data));
  }, []);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = userSearch ? `?search=${encodeURIComponent(userSearch)}` : '';
    axios.get(`/api/admin/users${params}`)
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false));
  }, [userSearch]);

  const fetchCategories = useCallback(() => {
    axios.get('/api/categories').then(r => setCategories(r.data));
  }, []);

  useEffect(() => { fetchAnalytics(); fetchCategories(); }, [fetchAnalytics, fetchCategories]);
  useEffect(() => { if (tab === 'users') fetchUsers(); }, [tab, fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    await axios.put(`/api/admin/users/${userId}`, { role });
    fetchUsers(); flash('Role updated');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    await axios.delete(`/api/admin/users/${userId}`);
    fetchUsers(); flash('User deleted');
  };

  const handleAddCategory = async e => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    await axios.post('/api/categories', { name: newCategory.trim() });
    setNewCategory(''); fetchCategories(); flash('Category added');
  };

  const handleSaveCategory = async (id) => {
    await axios.put(`/api/categories/${id}`, { name: editCat.name });
    setEditCat(null); fetchCategories(); flash('Category updated');
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await axios.delete(`/api/categories/${id}`);
    fetchCategories(); flash('Category deleted');
  };

  const sidebarItems = [
    { key: 'analytics', icon: '📊', label: 'Analytics' },
    { key: 'users', icon: '👥', label: 'User Management' },
    { key: 'categories', icon: '🏷️', label: 'Categories' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Admin Dashboard ⚙️</h2>
        <p className="page-subtitle">Platform oversight and management</p>
      </div>

      {msg && <div className="alert alert-success" style={{ maxWidth: 400 }}>{msg}</div>}

      <div className="dashboard-layout">
        <aside className="sidebar">
          {sidebarItems.map(item => (
            <button key={item.key} className={`sidebar-item${tab === item.key ? ' active' : ''}`} onClick={() => setTab(item.key)}>
              <span className="icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </aside>

        <main>
          {/* ANALYTICS */}
          {tab === 'analytics' && analytics && (
            <>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1.25rem' }}>Platform Overview</h3>
              <div className="stats-grid">
                <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{analytics.totalUsers}</div></div>
                <div className="stat-card"><div className="stat-label">Total Recipes</div><div className="stat-value">{analytics.totalRecipes}</div></div>
                <div className="stat-card"><div className="stat-label">Total Views</div><div className="stat-value">{analytics.totalViews?.toLocaleString()}</div></div>
                <div className="stat-card"><div className="stat-label">Total Reviews</div><div className="stat-value">{analytics.totalReviews}</div></div>
                <div className="stat-card"><div className="stat-label">Chefs</div><div className="stat-value">{analytics.chefs}</div></div>
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: '1.5rem 0 1rem' }}>Recent Recipes</h3>
              <div className="table-container">
                <table>
                  <thead><tr><th>Title</th><th>Chef</th><th>Category</th><th>Date</th></tr></thead>
                  <tbody>
                    {analytics.recentRecipes?.map(r => (
                      <tr key={r._id}>
                        <td style={{ fontWeight: 500 }}>{r.title}</td>
                        <td>{r.chef?.name || '—'}</td>
                        <td>{r.category?.name || '—'}</td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem' }}>User Management</h3>
                <form onSubmit={e => { e.preventDefault(); fetchUsers(); }} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input className="form-input" style={{ margin: 0 }} placeholder="Search by name or email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                  <button type="submit" className="btn btn-primary btn-sm">Search</button>
                </form>
              </div>
              {loading ? <div className="loading"><div className="spinner" /></div> : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              <img src={u.profileImage || `https://i.pravatar.cc/32?u=${u._id}`} alt={u.name}
                                style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                                onError={e => { e.target.src = `https://i.pravatar.cc/32?u=${u._id}`; }} />
                              <span style={{ fontWeight: 500 }}>{u.name}</span>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                          <td>
                            <select
                              className="form-input"
                              style={{ padding: '0.25rem 0.5rem', width: 'auto', margin: 0, fontSize: '0.85rem' }}
                              value={u.role}
                              onChange={e => handleRoleChange(u._id, e.target.value)}
                            >
                              <option value="user">User</option>
                              <option value="chef">Chef</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* CATEGORIES */}
          {tab === 'categories' && (
            <>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', marginBottom: '1.25rem' }}>Categories</h3>
              <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input className="form-input" style={{ margin: 0 }} placeholder="New category name..." value={newCategory} onChange={e => setNewCategory(e.target.value)} required />
                <button type="submit" className="btn btn-primary">Add</button>
              </form>
              <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Actions</th></tr></thead>
                  <tbody>
                    {categories.map(c => (
                      <tr key={c._id}>
                        <td>
                          {editCat?._id === c._id ? (
                            <input className="form-input" style={{ margin: 0, padding: '0.375rem 0.625rem' }}
                              value={editCat.name} onChange={e => setEditCat({ ...editCat, name: e.target.value })} autoFocus />
                          ) : (
                            <span style={{ fontWeight: 500 }}>{c.name}</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {editCat?._id === c._id ? (
                              <>
                                <button className="btn btn-primary btn-sm" onClick={() => handleSaveCategory(c._id)}>Save</button>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditCat(null)}>Cancel</button>
                              </>
                            ) : (
                              <>
                                <button className="btn btn-outline btn-sm" onClick={() => setEditCat(c)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(c._id)}>Delete</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
