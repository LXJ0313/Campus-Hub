import { Router } from 'express';
import {
  listRegisteredActivities,
  createRegistration,
  deleteRegistration,
} from '../store';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const registrations = await listRegisteredActivities();
    res.json(registrations);
  } catch (err) {
    console.error('Get registrations error:', err);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { activity_id } = req.body;

    if (!activity_id) {
      return res.status(400).json({ error: 'activity_id is required' });
    }

    const result = await createRegistration(activity_id);

    if (result.status === 'not_found') {
      return res.status(404).json({ error: 'Activity not found' });
    }
    if (result.status === 'exists') {
      return res.status(409).json({ error: 'Already registered for this activity' });
    }

    res.status(201).json(result.data);
  } catch (err) {
    console.error('Create registration error:', err);
    res.status(500).json({ error: 'Failed to create registration' });
  }
});

router.delete('/:activityId', async (req, res) => {
  try {
    const { activityId } = req.params;
    const removed = await deleteRegistration(activityId);

    if (!removed) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.json({ message: 'Registration cancelled successfully' });
  } catch (err) {
    console.error('Delete registration error:', err);
    res.status(500).json({ error: 'Failed to cancel registration' });
  }
});

export default router;
