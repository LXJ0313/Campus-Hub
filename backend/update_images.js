require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

(async () => {
  const updates = [
    ['activity_ai_001', '/images/ai_lecture.svg'],
    ['activity_career_001', '/images/career_share.svg'],
    ['activity_volunteer_001', '/images/volunteer.svg'],
    ['activity_sports_001', '/images/basketball.svg'],
    ['activity_competition_001', '/images/competition.svg'],
    ['activity_culture_001', '/images/poetry.svg'],
  ];
  for (const [id, url] of updates) {
    const r = await pool.query('UPDATE activities SET image_url = $1 WHERE activity_id = $2', [url, id]);
    console.log(id, '=>', url, '(rows: ' + r.rowCount + ')');
  }
  const check = await pool.query('SELECT activity_id, image_url FROM activities ORDER BY activity_id');
  check.rows.forEach(row => console.log('VERIFY:', row.activity_id, '=>', row.image_url));
  await pool.end();
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
