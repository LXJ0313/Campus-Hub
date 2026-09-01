import { useNavigate } from 'react-router-dom';
import { Activity } from '../types';

interface ActivityCardProps {
  activity: Activity;
  showFavorite?: boolean;
  showRegistration?: boolean;
}

export default function ActivityCard({
  activity,
  showFavorite = false,
  showRegistration = false,
}: ActivityCardProps) {
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="activity-card"
      onClick={() => navigate(`/activity/${activity.activity_id}`)}
    >
      <div className="card-image">
        {activity.image_url ? (
          <img src={activity.image_url} alt={activity.title} />
        ) : (
          <div className="placeholder-image">📅</div>
        )}
        <span className="card-category">{activity.category}</span>
      </div>
      <div className="card-content">
        <h3 className="card-title">{activity.title}</h3>
        <div className="card-info">
          <span className="info-item">🕐 {formatDate(activity.start_time)}</span>
          <span className="info-item">📍 {activity.location}</span>
          <span className="info-item">🏢 {activity.organizer}</span>
        </div>
        {activity.tags && (
          <div className="card-tags">
            {activity.tags.split(',').slice(0, 3).map((tag, i) => (
              <span key={i} className="tag">#{tag.trim()}</span>
            ))}
          </div>
        )}
        <div className="card-actions">
          {showFavorite && (
            <span className={`action-item ${activity.is_favorite ? 'active' : ''}`}>
              {activity.is_favorite ? '♥ 已收藏' : '♡ 收藏'}
            </span>
          )}
          {showRegistration && (
            <span className={`action-item ${activity.is_registered ? 'active' : ''}`}>
              {activity.is_registered ? '✓ 已报名' : '报名'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
