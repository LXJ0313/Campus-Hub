import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import activityRoutes from './routes/activities';
import favoriteRoutes from './routes/favorites';
import registrationRoutes from './routes/registrations';
import searchRoutes from './routes/search';
import { getCounts } from './store';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/activities', activityRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/search', searchRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    const counts = await getCounts();
    res.json({ status: 'ok', ...counts });
  } catch (err) {
    console.error('Health check failed:', err);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Campus Hub Backend running on port ${PORT}`);
});

export default app;
