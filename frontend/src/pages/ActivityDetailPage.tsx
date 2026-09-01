import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Activity } from '../types';
import {
  fetchActivity,
  createFavorite,
  removeFavorite,
  createRegistration,
  removeRegistration,
} from '../api';

export default function ActivityDetailPage() {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (activityId) loadActivity(activityId);
  }, [activityId]);

  async function loadActivity(id: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActivity(id);
      setActivity(data);
    } catch (err: any) {
      setError(err.message || '加载失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleFavorite() {
    if (!activity || actionLoading) return;
    setActionLoading(true);
    try {
      if (activity.is_favorite) {
        await removeFavorite(activity.activity_id);
        setActivity({ ...activity, is_favorite: false });
        setFeedback('已取消收藏');
      } else {
        await createFavorite(activity.activity_id);
        setActivity({ ...activity, is_favorite: true });
        setFeedback('收藏成功');
      }
      setTimeout(() => setFeedback(null), 2000);
    } catch (err: any) {
      setFeedback(err.message || '操作失败');
      setTimeout(() => setFeedback(null), 2000);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRegistration() {
    if (!activity || actionLoading) return;
    setActionLoading(true);
    try {
      if (activity.is_registered) {
        await removeRegistration(activity.activity_id);
        setActivity({ ...activity, is_registered: false });
        setFeedback('已取消报名');
      } else {
        await createRegistration(activity.activity_id);
        setActivity({ ...activity, is_registered: true });
        setFeedback('报名成功！');
      }
      setTimeout(() => setFeedback(null), 2000);
    } catch (err: any) {
      setFeedback(err.message || '操作失败');
      setTimeout(() => setFeedback(null), 2000);
    } finally {
      setActionLoading(false);
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <div className="loading-page">加载中...</div>;
  }

  if (error || !activity) {
    return (
      <div className="error-page">
        <p>{error || '活动不存在'}</p>
        <button className="retry-btn" onClick={() => activityId && loadActivity(activityId)}>
          重新加载
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          返回
        </button>
      </div>
    );
  }

  return (
    <div className="activity-detail-page">
      {feedback && <div className="toast">{feedback}</div>}

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← 返回
      </button>

      <div className="detail-header">
        {activity.image_url && (
          <div className="detail-image">
            <img src={activity.image_url} alt={activity.title} />
          </div>
        )}
        <span className="detail-category">{activity.category}</span>
        <h1 className="detail-title">{activity.title}</h1>
      </div>

      {activity.ai_summary && (
        <section className="detail-section ai-summary-section">
          <h2 className="section-label">🤖 AI 摘要</h2>
          <p className="ai-summary">{activity.ai_summary}</p>
        </section>
      )}

      <section className="detail-section">
        <h2 className="section-label">📌 活动信息</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">时间</span>
            <span className="info-value">
              {formatDate(activity.start_time)} - {formatDate(activity.end_time)}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">地点</span>
            <span className="info-value">{activity.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">主办方</span>
            <span className="info-value">{activity.organizer}</span>
          </div>
          {activity.registration_deadline && (
            <div className="info-item">
              <span className="info-label">报名截止</span>
              <span className="info-value">{formatDate(activity.registration_deadline)}</span>
            </div>
          )}
          {activity.capacity && (
            <div className="info-item">
              <span className="info-label">容量</span>
              <span className="info-value">{activity.capacity} 人</span>
            </div>
          )}
          {activity.target_audience && (
            <div className="info-item">
              <span className="info-label">适合人群</span>
              <span className="info-value">{activity.target_audience}</span>
            </div>
          )}
        </div>
      </section>

      {activity.tags && (
        <section className="detail-section">
          <h2 className="section-label">🏷️ 标签</h2>
          <div className="tags-list">
            {activity.tags.split(',').map((tag, i) => (
              <span key={i} className="tag">{tag.trim()}</span>
            ))}
          </div>
        </section>
      )}

      <section className="detail-section">
        <h2 className="section-label">📝 活动详情</h2>
        <p className="description">{activity.description}</p>
      </section>

      <div className="detail-actions">
        <button
          className={`action-btn favorite-btn ${activity.is_favorite ? 'active' : ''}`}
          onClick={handleFavorite}
          disabled={actionLoading}
        >
          {activity.is_favorite ? '♥ 已收藏' : '♡ 收藏'}
        </button>
        <button
          className={`action-btn register-btn ${activity.is_registered ? 'active' : ''}`}
          onClick={handleRegistration}
          disabled={actionLoading}
        >
          {activity.is_registered ? '✓ 已报名' : '立即报名'}
        </button>
      </div>
    </div>
  );
}
