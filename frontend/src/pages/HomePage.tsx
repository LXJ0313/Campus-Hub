import { useEffect, useState, useCallback } from 'react';
import { Activity } from '../types';
import { fetchActivities } from '../api';
import ActivityCard from '../components/ActivityCard';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchActivities();
      setActivities(data);
    } catch (err) {
      console.error('Failed to load activities:', err);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return (
    <div className="home-page">
      <div className="home-search" onClick={() => navigate('/search')}>
        <span className="search-placeholder">🔍 搜索活动 / 或提问...</span>
      </div>

      <section className="section">
        <h2 className="section-title">
          🔥 推荐活动
          {!loading && activities.length > 0 && <span className="result-count">({activities.length})</span>}
        </h2>
        {loading ? (
          <div className="loading">加载中...</div>
        ) : activities.length === 0 ? (
          <div className="empty-state">暂无活动</div>
        ) : (
          <div className="activity-grid">
            {activities.map((activity) => (
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
