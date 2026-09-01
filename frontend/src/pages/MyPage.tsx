import { useEffect, useState } from 'react';
import { Activity } from '../types';
import { fetchFavorites, fetchRegistrations } from '../api';
import ActivityCard from '../components/ActivityCard';

const CURRENT_USER = {
  name: '李明',
  avatar: '/images/avatar.svg',
  school: '计算机学院',
  department: '计算机科学与技术专业',
};

type TabType = 'favorites' | 'registrations';

export default function MyPage() {
  const [favorites, setFavorites] = useState<Activity[]>([]);
  const [registrations, setRegistrations] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('favorites');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [favs, regs] = await Promise.all([
        fetchFavorites(),
        fetchRegistrations(),
      ]);
      setFavorites(favs);
      setRegistrations(regs);
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="my-page">
      <section className="user-profile">
        <div className="avatar">
          {CURRENT_USER.avatar ? (
            <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
        </div>
        <div className="user-info">
          <h2 className="user-name">{CURRENT_USER.name}</h2>
          <p className="user-org">{CURRENT_USER.school}</p>
          <p className="user-dept">{CURRENT_USER.department}</p>
        </div>
      </section>

      <div className="tab-bar">
        <button
          className={`tab-item ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          我的收藏 ({favorites.length})
        </button>
        <button
          className={`tab-item ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          我的报名 ({registrations.length})
        </button>
      </div>

      <section className="section">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : activeTab === 'favorites' ? (
          favorites.length === 0 ? (
            <div className="empty-state">暂无收藏活动</div>
          ) : (
            <div className="activity-grid">
              {favorites.map((activity) => (
                <ActivityCard
                  key={activity.activity_id}
                  activity={activity}
                  showFavorite
                  showRegistration
                />
              ))}
            </div>
          )
        ) : registrations.length === 0 ? (
          <div className="empty-state">暂无报名活动</div>
        ) : (
          <div className="activity-grid">
            {registrations.map((activity) => (
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
