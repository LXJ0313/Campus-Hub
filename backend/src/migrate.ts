import { query, end } from './db';

// DDL strictly follows DATA_SCHEMA.md:
// - users / activities / favorites / registrations
// - tags / target_audience are String[] -> TEXT[]
// - UNIQUE(user_id, activity_id) on favorites and registrations (Rule 2 & 3)
// - Registration status CHECK ('registered' is the only V1 status, Section 13)
// - IDs use app-generated TEXT values (matches existing API behavior)
const DDL_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    user_id     TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    avatar_url  TEXT,
    school      TEXT,
    department  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS activities (
    activity_id           TEXT PRIMARY KEY,
    title                 TEXT NOT NULL,
    category              TEXT NOT NULL,
    description           TEXT NOT NULL,
    tags                  TEXT[],
    target_audience       TEXT[],
    start_time            TIMESTAMPTZ NOT NULL,
    end_time              TIMESTAMPTZ NOT NULL,
    location              TEXT NOT NULL,
    organizer             TEXT NOT NULL,
    registration_deadline TIMESTAMPTZ,
    capacity              INTEGER,
    image_url             TEXT,
    ai_summary            TEXT,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS favorites (
    favorite_id TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL REFERENCES users(user_id),
    activity_id TEXT NOT NULL REFERENCES activities(activity_id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, activity_id)
  )`,
  `CREATE TABLE IF NOT EXISTS registrations (
    registration_id TEXT PRIMARY KEY,
    user_id         TEXT NOT NULL REFERENCES users(user_id),
    activity_id     TEXT NOT NULL REFERENCES activities(activity_id),
    status          TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered')),
    registered_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, activity_id)
  )`,
];

async function main() {
  console.log('Starting PostgreSQL migration (CREATE TABLE IF NOT EXISTS)...');

  for (const ddl of DDL_STATEMENTS) {
    await query(ddl);
  }

  const result = await query(
    'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema ORDER BY table_name'
  );
  console.log('✓ tables now present:', result.rows.map((r) => r.table_name).join(', '));
  console.log('\n✅ Migration completed successfully!');

  await end();
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
