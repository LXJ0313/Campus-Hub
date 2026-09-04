import { useState, useEffect, useRef } from 'react';
import { Activity, SearchResult } from '../types';
import { aiSearch, fetchActivities } from '../api';
import ActivityCard from '../components/ActivityCard';

const categories = ['All', 'Lecture', 'Career', 'Volunteer', 'Sports', 'Competition', 'Culture'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Activity[]>([]);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Refs for synchronous state access in callbacks
  const queryRef = useRef('');
  const categoryRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  // Keep refs in sync
  queryRef.current = query;
  categoryRef.current = selectedCategory;

  const aiSuggestions = [
    '本周有哪些AI讲座？',
    '适合研究生参加的AI活动',
    '有哪些职业规划活动？',
  ];

  // ── Core data fetching ──────────────────────────────────────────────────

  function fetchBrowse(category?: string) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    fetchActivities(category)
      .then((data) => {
        if (requestId !== requestIdRef.current) return;
        setResults(data);
        setSearchResult(null);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        console.error('Failed to fetch activities:', err);
        setResults([]);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }

  function doSearch() {
    const q = queryRef.current.trim();
    const cat = categoryRef.current;
    if (!q) {
      fetchBrowse(cat || undefined);
      return;
    }
    const requestId = ++requestIdRef.current;
    setLoading(true);
    aiSearch(q, cat || undefined)
      .then((result) => {
        if (requestId !== requestIdRef.current) return;
        setSearchResult(result);
        setResults(result.results);
      })
      .catch((err) => {
        if (requestId !== requestIdRef.current) return;
        console.error('Search failed:', err);
        setResults([]);
      })
      .finally(() => {
        if (requestId === requestIdRef.current) setLoading(false);
      });
  }

  // ── Effect: responds ONLY to category changes ────────────────────────
  // On mount: loads all activities (browse All)
  // On category click: switches between browse/search mode using latest query
  useEffect(() => {
    if (queryRef.current.trim()) {
      doSearch();
    } else {
      fetchBrowse(categoryRef.current || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // ── Handlers ──────────────────────────────────────────────────────────

  function onQueryChange(value: string) {
    setQuery(value);
    // When user clears the search box → immediately switch to browse mode
    if (!value.trim()) {
      fetchBrowse(categoryRef.current || undefined);
      setSearchResult(null);
    }
  }

  function onCategoryClick(cat: string) {
    if (cat === 'All') {
      // "全部": clear query + category and always explicitly re-fetch all
      // (when selectedCategory was already null, the state change alone
      // would NOT re-trigger the effect)
      setQuery('');
      setSelectedCategory(null);
      setSearchResult(null);
      fetchBrowse(undefined);
    } else {
      setSelectedCategory(cat);
    }
  }

  function onSuggestionClick(s: string) {
    setQuery(s);
    // Defer search to next tick so state refs are updated
    setTimeout(() => doSearch(), 0);
  }

  // ── Derived values for UI ─────────────────────────────────────────────

  const isBrowseMode = !query.trim();
  const headerTitle = isBrowseMode
    ? (selectedCategory ? `${selectedCategory} 活动` : '全部活动')
    : '搜索结果';
  const emptyMessage = isBrowseMode
    ? (selectedCategory ? '当前分类下暂无活动' : '暂无活动')
    : '没有找到相关活动，试试其他关键词';

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="search-page">
      <div className="search-input-area">
        <input
          type="text"
          className="search-input"
          placeholder="输入关键词 / 或提问"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') doSearch();
          }}
        />
        <button className="ai-search-btn" onClick={() => doSearch()}>
          🤖 AI搜索
        </button>
      </div>

      <div className="ai-suggestions">
        <span className="suggestion-label">💡 试试这样问：</span>
        {aiSuggestions.map((s, i) => (
          <button key={i} className="suggestion-btn" onClick={() => onSuggestionClick(s)}>
            {s}
          </button>
        ))}
      </div>

      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${selectedCategory === cat || (cat === 'All' && !selectedCategory) ? 'active' : ''}`}
            onClick={() => onCategoryClick(cat)}
          >
            {cat === 'All' ? '全部' : cat}
          </button>
        ))}
      </div>

      {searchResult?.interpreted && (
        <div className="search-interpreted">
          <span>AI 理解：关键词</span>
          <strong>{searchResult.interpreted.keywords}</strong>
          {searchResult.interpreted.category && (
            <>
              <span> · 分类</span>
              <strong>{searchResult.interpreted.category}</strong>
            </>
          )}
        </div>
      )}

      <section className="section">
        <h2 className="section-title">
          {headerTitle} {results.length > 0 && <span className="result-count">({results.length})</span>}
        </h2>
        {loading ? (
          <div className="loading">{isBrowseMode ? '加载中...' : '搜索中...'}</div>
        ) : results.length === 0 ? (
          <div className="empty-state">{emptyMessage}</div>
        ) : (
          <div className="activity-grid">
            {results.map((activity) => (
              <ActivityCard
                key={activity.activity_id}
                activity={activity}
                showFavorite
                showRegistration
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
