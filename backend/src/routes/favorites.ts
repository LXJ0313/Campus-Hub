import { Router } from 'express';
import { listFavoriteActivities, createFavorite, deleteFavorite } from '../store';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const favorites = await listFavoriteActivities();
    res.json(favorites);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { activity_id } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: 'activity_id is required' });
    }

    const result = await createFavorite(activity_id);

    if (result.status === 'not_found') {
      return res.status(404).json({ error: 'Activity not found' });
    }
    if (result.status === 'exists') {
      return res.status(409).json({ error: 'Already favorited' });
    }

    res.status(201).json(result.data);
  } catch (err) {
    console.error('Create favorite error:', err);
    res.status(500).json({ error: 'Failed to create favorite' });
  }
});

router.delete('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const removed = await deleteFavorite(activityId);

    if (!removed) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

export default router;
