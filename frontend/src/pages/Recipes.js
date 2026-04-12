import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RecipeCard from '../components/RecipeCard';

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 12 });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    axios.get(`/api/recipes?${params}`)
      .then(r => { setRecipes(r.data.recipes); setTotal(r.data.total); setPages(r.data.pages); })
      .finally(() => setLoading(false));
  }, [search, category, sort, page]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearch = e => {
    e.preventDefault();
    setParam('search', searchInput);
  };

  return (
    <div className="page">
      {/* Filters bar */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: 240 }}>
          <input
            className="form-input"
            style={{ margin: 0 }}
            placeholder="Search recipes..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <select className="form-input" style={{ width: 'auto', margin: 0 }} value={sort} onChange={e => setParam('sort', e.target.value)}>
          <option value="">Newest</option>
          <option value="views">Most Viewed</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="category-pills" style={{ justifyContent: 'flex-start', marginBottom: '1.75rem' }}>
        <span className={`category-pill${!category ? ' active' : ''}`} onClick={() => setParam('category', '')}>All</span>
        {categories.map(c => (
          <span
            key={c._id}
            className={`category-pill${category === c._id ? ' active' : ''}`}
            onClick={() => setParam('category', c._id)}
          >{c.name}</span>
        ))}
      </div>

      {/* Results header */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <h2 className="page-title">
          {search ? `Results for "${search}"` : category ? categories.find(c => c._id === category)?.name || 'Recipes' : 'All Recipes'}
        </h2>
        <p className="page-subtitle">{total} recipe{total !== 1 ? 's' : ''} found</p>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner" /></div>
      ) : recipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <div className="empty-title">No recipes found</div>
          <p>Try a different search or category</p>
        </div>
      ) : (
        <>
          <div className="recipe-grid">
            {recipes.map(r => <RecipeCard key={r._id} recipe={r} />)}
          </div>
          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '2.5rem' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`btn ${p === page ? 'btn-primary' : 'btn-outline'} btn-sm`}
                  onClick={() => { const np = new URLSearchParams(searchParams); np.set('page', p); setSearchParams(np); }}
                >{p}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
