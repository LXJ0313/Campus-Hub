import { query } from './db';

export const CURRENT_USER_ID = 'user_001';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ActivityRow {
  activity_id: string;
  title: string;
  category: string;
  description: string;
  tags: string[] | null;
  target_audience: string[] | null;
  start_time: Date;
  end_time: Date;
  location: string;
  organizer: string;
  registration_deadline: Date | null;
  capacity: number | null;
  image_url: string | null;
  ai_summary: string | null;
  created_at: Date;
  is_favorite?: boolean;
  is_registered?: boolean;
}

interface RegistrationJoinRow extends ActivityRow {
  status: string;
  registered_at: Date;
}

export interface Activity {
  activity_id: string;
  title: string;
  category: string;
  description: string;
  tags: string | null;
  target_audience: string | null;
  start_time: string;
  end_time: string;
  location: string;
  organizer: string;
  registration_deadline: string | null;
  capacity: number | null;
  image_url: string | null;
  ai_summary: string | null;
  created_at: string;
  is_favorite: boolean;
  is_registered: boolean;
  status?: string;
  registered_at?: string;
}

// ---------------------------------------------------------------------------
// Serialization: DB rows (TEXT[] / Date) -> API shape (comma-joined string / ISO string)
// Keeps the existing frontend contract unchanged (tags is "a,b,c").
// ---------------------------------------------------------------------------

function toDateIso(value: Date | null): string | null {
  return value ? new Date(value).toISOString() : null;
}

function serializeActivity(row: ActivityRow): Activity {
  return {
    activity_id: row.activity_id,
    title: row.title,
    category: row.category,
    description: row.description,
    tags: row.tags && row.tags.length > 0 ? row.tags.join(',') : null,
    target_audience:
      row.target_audience && row.target_audience.length > 0
        ? row.target_audience.join(',')
        : null,
    start_time: toDateIso(row.start_time)!,
    end_time: toDateIso(row.end_time)!,
    location: row.location,
    organizer: row.organizer,
    registration_deadline: toDateIso(row.registration_deadline),
    capacity: row.capacity,
    image_url: row.image_url,
    ai_summary: row.ai_summary,
    created_at: toDateIso(row.created_at)!,
    is_favorite: !!row.is_favorite,
    is_registered: !!row.is_registered,
  };
}

function serializeRegisteredActivity(row: RegistrationJoinRow): Activity {
  return {
    ...serializeActivity(row),
    is_registered: true,
    status: row.status,
    registered_at: toDateIso(row.registered_at)!,
  };
}

// ---------------------------------------------------------------------------
// Activity queries (platform data, enriched with user-specific state)
// ---------------------------------------------------------------------------

const ACTIVITY_COLUMNS = `
  a.activity_id, a.title, a.category, a.description, a.tags, a.target_audience,
  a.start_time, a.end_time, a.location, a.organizer, a.registration_deadline,
  a.capacity, a.image_url, a.ai_summary, a.created_at
`;

const USER_STATE_COLUMNS = `
  EXISTS (SELECT 1 FROM favorites f WHERE f.user_id = $1 AND f.activity_id = a.activity_id) AS is_favorite,
  EXISTS (SELECT 1 FROM registrations r WHERE r.user_id = $1 AND r.activity_id = a.activity_id) AS is_registered
`;

export async function listActivities(opts: {
  category?: string;
  search?: string;
  limit?: number;
} = {}): Promise<Activity[]> {
  const userId = CURRENT_USER_ID;
  const params: unknown[] = [userId];
  let where = '';
  let paramIndex = 2;

  if (opts.category) {
    where += ` AND a.category = $${paramIndex++}`;
    params.push(opts.category);
  }

  if (opts.search) {
    const pattern = `%${opts.search}%`;
    where += ` AND (a.title ILIKE $${paramIndex} OR a.description ILIKE $${paramIndex} OR array_to_string(a.tags, ',') ILIKE $${paramIndex})`;
    paramIndex++;
    params.push(pattern);
  }

  let limitClause = '';
  if (opts.limit && opts.limit > 0) {
    limitClause = ` LIMIT $${paramIndex++}`;
    params.push(opts.limit);
  }

  const sql = `
    SELECT ${ACTIVITY_COLUMNS}, ${USER_STATE_COLUMNS}
    FROM activities a
    WHERE 1=1 ${where}
    ORDER BY a.start_time ASC
    ${limitClause}
  `;

  const result = await query<ActivityRow>(sql, params);
  return result.rows.map(serializeActivity);
}

export async function getActivityById(activityId: string): Promise<Activity | null> {
  const sql = `
    SELECT ${ACTIVITY_COLUMNS}, ${USER_STATE_COLUMNS}
    FROM activities a
    WHERE a.activity_id = $2
  `;
  const result = await query<ActivityRow>(sql, [CURRENT_USER_ID, activityId]);
  if (result.rows.length === 0) return null;
  return serializeActivity(result.rows[0]);
}

// ---------------------------------------------------------------------------
// Search (keyword / category based, same matching semantics as before)
// ---------------------------------------------------------------------------

// Build a match condition for one ILIKE pattern parameter over the
// searchable activity fields (title / description / tags / target_audience).
function matchCond(p: number | string): string {
  return `(a.title ILIKE ${p} OR a.description ILIKE ${p} OR array_to_string(a.tags, ',') ILIKE ${p} OR array_to_string(a.target_audience, ',') ILIKE ${p})`;
}

export async function searchActivities(opts: {
  keywords?: string;
  category?: string;
}): Promise<Activity[]> {
  const userId = CURRENT_USER_ID;
  const params: unknown[] = [userId];
  let where = '';
  let paramIndex = 2;

  if (opts.category) {
    where += ` AND a.category = $${paramIndex++}`;
    params.push(opts.category);
  }

  if (opts.keywords) {
    const pattern = `%${opts.keywords}%`;
    where += ` AND ${matchCond(`$${paramIndex}`)}`;
    paramIndex++;
    params.push(pattern);
  }

  const sql = `
    SELECT ${ACTIVITY_COLUMNS}, ${USER_STATE_COLUMNS}
    FROM activities a
    WHERE 1=1 ${where}
    ORDER BY a.start_time ASC
  `;

  const result = await query<ActivityRow>(sql, params);
  return result.rows.map(serializeActivity);
}

// Multi-token natural-language search (DATA_SCHEMA.md #19: Filtering / Ranking).
// An activity matches when ANY token appears in title / description / tags /
// target_audience; results are ranked by number of matched tokens, then time.
// Category filter is ANDed with token matches; tokens are ORed within themselves.
export async function searchByTokens(opts: {
  tokens: string[];
  category?: string;
}): Promise<Activity[]> {
  const userId = CURRENT_USER_ID;
  const params: unknown[] = [userId];
  const conditions: string[] = [];
  const tokenConditions: string[] = [];
  const scoreParts: string[] = [];
  let paramIndex = 2;

  // Category filter (AND with all other conditions)
  if (opts.category) {
    params.push(opts.category);
    conditions.push(`a.category = $${paramIndex++}`);
  }

  // Token matching: each token is an OR condition; the whole group is ANDed with category
  for (const token of opts.tokens) {
    const pattern = `%${token}%`;
    params.push(pattern);
    const p = paramIndex++;
    const cond = matchCond(`$${p}`);
    tokenConditions.push(cond);
    scoreParts.push(`(CASE WHEN ${cond} THEN 1 ELSE 0 END)`);
  }

  if (tokenConditions.length > 0) {
    const tokenGroup = tokenConditions.length > 1
    ? `(${tokenConditions.join(' AND ')})`
    : tokenConditions[0];
    conditions.push(tokenGroup);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const order = scoreParts.length > 0 ? `${scoreParts.join(' + ')} DESC, a.start_time ASC` : 'a.start_time ASC';

  const sql = `
    SELECT ${ACTIVITY_COLUMNS}, ${USER_STATE_COLUMNS}
    FROM activities a
    ${where}
    ORDER BY ${order}
  `;

  const result = await query<ActivityRow>(sql, params);
  return result.rows.map(serializeActivity);
}

// ---------------------------------------------------------------------------
// Favorites (user-specific relationship)
// ---------------------------------------------------------------------------

export async function listFavoriteActivities(userId: string = CURRENT_USER_ID): Promise<Activity[]> {
  const sql = `
    SELECT ${ACTIVITY_COLUMNS},
      true AS is_favorite,
      EXISTS (SELECT 1 FROM registrations r WHERE r.user_id = f.user_id AND r.activity_id = a.activity_id) AS is_registered
    FROM favorites f
    JOIN activities a ON a.activity_id = f.activity_id
    WHERE f.user_id = $1
    ORDER BY f.created_at ASC
  `;
  const result = await query<ActivityRow>(sql, [userId]);
  return result.rows.map(serializeActivity);
}

export async function createFavorite(
  activityId: string,
  userId: string = CURRENT_USER_ID
): Promise<{ status: 'created' | 'exists' | 'not_found'; data?: unknown }> {
  const exists = await query('SELECT 1 FROM activities WHERE activity_id = $1', [activityId]);
  if (exists.rowCount === 0) return { status: 'not_found' };

  const favoriteId = `fav_${Date.now()}`;
  const result = await query<{
    favorite_id: string;
    user_id: string;
    activity_id: string;
    created_at: Date;
  }>(
    `INSERT INTO favorites (favorite_id, user_id, activity_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, activity_id) DO NOTHING
     RETURNING favorite_id, user_id, activity_id, created_at`,
    [favoriteId, userId, activityId]
  );

  if (result.rowCount === 0) return { status: 'exists' };
  return {
    status: 'created',
    data: {
      favorite_id: result.rows[0].favorite_id,
      user_id: result.rows[0].user_id,
      activity_id: result.rows[0].activity_id,
      created_at: toDateIso(result.rows[0].created_at),
    },
  };
}

export async function deleteFavorite(
  activityId: string,
  userId: string = CURRENT_USER_ID
): Promise<boolean> {
  const result = await query(
    'DELETE FROM favorites WHERE user_id = $1 AND activity_id = $2',
    [userId, activityId]
  );
  return (result.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Registrations (user-specific relationship)
// ---------------------------------------------------------------------------

export async function listRegisteredActivities(
  userId: string = CURRENT_USER_ID
): Promise<Activity[]> {
  const sql = `
    SELECT ${ACTIVITY_COLUMNS},
      EXISTS (SELECT 1 FROM favorites f WHERE f.user_id = r.user_id AND f.activity_id = a.activity_id) AS is_favorite,
      true AS is_registered,
      r.status, r.registered_at
    FROM registrations r
    JOIN activities a ON a.activity_id = r.activity_id
    WHERE r.user_id = $1
    ORDER BY r.registered_at ASC
  `;
  const result = await query<RegistrationJoinRow>(sql, [userId]);
  return result.rows.map(serializeRegisteredActivity);
}

export async function createRegistration(
  activityId: string,
  userId: string = CURRENT_USER_ID
): Promise<{ status: 'created' | 'exists' | 'not_found'; data?: unknown }> {
  const exists = await query('SELECT 1 FROM activities WHERE activity_id = $1', [activityId]);
  if (exists.rowCount === 0) return { status: 'not_found' };

  const registrationId = `reg_${Date.now()}`;
  const result = await query<{
    registration_id: string;
    user_id: string;
    activity_id: string;
    status: string;
    registered_at: Date;
  }>(
    `INSERT INTO registrations (registration_id, user_id, activity_id, status)
     VALUES ($1, $2, $3, 'registered')
     ON CONFLICT (user_id, activity_id) DO NOTHING
     RETURNING registration_id, user_id, activity_id, status, registered_at`,
    [registrationId, userId, activityId]
  );

  if (result.rowCount === 0) return { status: 'exists' };
  return {
    status: 'created',
    data: {
      registration_id: result.rows[0].registration_id,
      user_id: result.rows[0].user_id,
      activity_id: result.rows[0].activity_id,
      status: result.rows[0].status,
      registered_at: toDateIso(result.rows[0].registered_at),
    },
  };
}

export async function deleteRegistration(
  activityId: string,
  userId: string = CURRENT_USER_ID
): Promise<boolean> {
  const result = await query(
    'DELETE FROM registrations WHERE user_id = $1 AND activity_id = $2',
    [userId, activityId]
  );
  return (result.rowCount ?? 0) > 0;
}

// ---------------------------------------------------------------------------
// Health check counts
// ---------------------------------------------------------------------------

export async function getCounts(): Promise<{
  users: number;
  activities: number;
  favorites: number;
  registrations: number;
}> {
  const result = await query(`
    SELECT
      (SELECT count(*) FROM users) AS users,
      (SELECT count(*) FROM activities) AS activities,
      (SELECT count(*) FROM favorites) AS favorites,
      (SELECT count(*) FROM registrations) AS registrations
  `);
  const row = result.rows[0];
  return {
    users: Number(row.users),
    activities: Number(row.activities),
    favorites: Number(row.favorites),
    registrations: Number(row.registrations),
  };
}
