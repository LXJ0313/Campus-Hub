import { Router } from 'express';
import { listActivities, getActivityById } from '../store';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category, search, limit } = req.query;

    const activities = await listActivities({
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      limit: limit ? parseInt(String(limit), 10) : undefined,
    });

    res.json(activities);
  } catch (err) {
    console.error('Get activities error:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

router.get('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const activity = await getActivityById(activityId);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json(activity);
  } catch (err) {
    console.error('Get activity error:', err);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

export default router;
