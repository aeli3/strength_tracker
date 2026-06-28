import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { ALL_EXERCISES } from '../data/exercises';
import { formatSessionDate } from '../utils/session-stats';
import type { Exercise, ExerciseHomeStats, ExerciseSet, TargetMuscleGroup } from '../types';

interface ExerciseRow {
  id: string;
  name: string;
  muscle_group: TargetMuscleGroup;
  source: 'seed' | 'custom';
  created_at: string;
}

interface SessionRow {
  id: string;
  exercise_id: string;
  logged_at: string;
  created_at: string;
}

interface SetRow {
  id: string;
  session_id: string;
  position: number;
  weight: number;
  reps: number;
}

interface LoggedAtRow {
  logged_at: string;
}

interface CountRow {
  count: number;
}

let databasePromise: Promise<SQLiteDatabase> | undefined;

export async function getExercises() {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ExerciseRow>(
    `SELECT id, name, muscle_group, source, created_at
     FROM exercises
     ORDER BY
       CASE muscle_group
         WHEN 'Chest' THEN 1
         WHEN 'Back' THEN 2
         WHEN 'Shoulders' THEN 3
         WHEN 'Arms' THEN 4
         WHEN 'Core' THEN 5
         WHEN 'Legs' THEN 6
         WHEN 'Glutes' THEN 7
         WHEN 'Cardio' THEN 8
         ELSE 99
       END,
       name COLLATE NOCASE ASC`,
  );

  return rows.map(mapExerciseRow);
}

export async function getExerciseById(exerciseId: string) {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ExerciseRow>(
    `SELECT id, name, muscle_group, source, created_at
     FROM exercises
     WHERE id = ?`,
    exerciseId,
  );

  return row ? mapExerciseRow(row) : undefined;
}

export async function createExercise(input: { name: string; muscleGroup: TargetMuscleGroup }) {
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const id = await createExerciseId(db, input.name, input.muscleGroup);

  await db.runAsync(
    `INSERT INTO exercises (id, name, muscle_group, source, created_at)
     VALUES (?, ?, ?, 'custom', ?)`,
    id,
    input.name.trim(),
    input.muscleGroup,
    createdAt,
  );

  return { id, name: input.name.trim(), muscleGroup: input.muscleGroup };
}

export async function getExerciseSessions(exerciseId: string) {
  const db = await getDatabase();
  const sessionRows = await db.getAllAsync<SessionRow>(
    `SELECT id, exercise_id, logged_at, created_at
     FROM exercise_sessions
     WHERE exercise_id = ?
     ORDER BY logged_at DESC`,
    exerciseId,
  );

  if (sessionRows.length === 0) {
    return [];
  }

  const sessionIds = sessionRows.map(row => row.id);
  const placeholders = sessionIds.map(() => '?').join(', ');
  const setRows = await db.getAllAsync<SetRow>(
    `SELECT id, session_id, position, weight, reps
     FROM exercise_sets
     WHERE session_id IN (${placeholders})
     ORDER BY session_id, position ASC`,
    ...sessionIds,
  );
  const bestWeight = Math.max(...setRows.map(row => row.weight), 0);

  return sessionRows.map(row => {
    const sets = setRows
      .filter(set => set.session_id === row.id)
      .map(
        (set): ExerciseSet => ({
          id: set.id,
          weight: set.weight,
          reps: set.reps,
        }),
      );

    return {
      id: row.id,
      exerciseId: row.exercise_id,
      loggedAt: row.logged_at,
      dateLabel: formatSessionDate(new Date(row.logged_at)),
      sets,
      isPr: sets.some(set => set.weight === bestWeight && bestWeight > 0),
    };
  });
}

export async function getExerciseHomeStats(): Promise<ExerciseHomeStats> {
  const db = await getDatabase();
  const now = new Date();
  const weekStart = getStartOfWeek(now).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const weeklyRow = await db.getFirstAsync<CountRow>(
    `SELECT COUNT(*) AS count
     FROM exercise_sessions
     WHERE logged_at >= ?`,
    weekStart,
  );
  const prRow = await db.getFirstAsync<CountRow>(
    `SELECT COUNT(DISTINCT sessions.id) AS count
     FROM exercise_sessions sessions
     JOIN exercise_sets sets ON sets.session_id = sessions.id
     JOIN (
       SELECT sessions.exercise_id, MAX(sets.weight) AS best_weight
       FROM exercise_sessions sessions
       JOIN exercise_sets sets ON sets.session_id = sessions.id
       GROUP BY sessions.exercise_id
     ) bests
       ON bests.exercise_id = sessions.exercise_id
      AND bests.best_weight = sets.weight
     WHERE sessions.logged_at >= ?`,
    monthStart,
  );
  const loggedRows = await db.getAllAsync<LoggedAtRow>(
    `SELECT logged_at
     FROM exercise_sessions
     ORDER BY logged_at DESC`,
  );

  return {
    weeklySessions: weeklyRow?.count ?? 0,
    streakDays: getStreakDays(loggedRows.map(row => row.logged_at), now),
    prsThisMonth: prRow?.count ?? 0,
  };
}

export async function createExerciseSession(exerciseId: string, set: Omit<ExerciseSet, 'id'>) {
  const db = await getDatabase();
  const loggedAt = new Date().toISOString();
  const sessionId = createId('session');
  const setId = createId('set');

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO exercise_sessions (id, exercise_id, logged_at, created_at)
       VALUES (?, ?, ?, ?)`,
      sessionId,
      exerciseId,
      loggedAt,
      loggedAt,
    );
    await db.runAsync(
      `INSERT INTO exercise_sets (id, session_id, position, weight, reps)
       VALUES (?, ?, ?, ?, ?)`,
      setId,
      sessionId,
      0,
      set.weight,
      set.reps,
    );
  });

  return sessionId;
}

export async function deleteExerciseSession(sessionId: string) {
  const db = await getDatabase();

  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM exercise_sets WHERE session_id = ?', sessionId);
    await db.runAsync('DELETE FROM exercise_sessions WHERE id = ?', sessionId);
  });
}

async function getDatabase() {
  databasePromise ??= openDatabaseAsync('strength-tracker.db').then(async db => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        muscle_group TEXT NOT NULL,
        source TEXT NOT NULL DEFAULT 'seed',
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS exercise_sessions (
        id TEXT PRIMARY KEY NOT NULL,
        exercise_id TEXT NOT NULL,
        logged_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS exercise_sets (
        id TEXT PRIMARY KEY NOT NULL,
        session_id TEXT NOT NULL,
        position INTEGER NOT NULL,
        weight REAL NOT NULL,
        reps INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_exercise_sessions_exercise_id
        ON exercise_sessions (exercise_id, logged_at DESC);

      CREATE INDEX IF NOT EXISTS idx_exercise_sets_session_id
        ON exercise_sets (session_id, position ASC);
    `);

    await seedExercises(db);

    return db;
  });

  return databasePromise;
}

async function seedExercises(db: SQLiteDatabase) {
  const seededAt = new Date(0).toISOString();

  await db.withTransactionAsync(async () => {
    for (const exercise of ALL_EXERCISES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO exercises (id, name, muscle_group, source, created_at)
         VALUES (?, ?, ?, 'seed', ?)`,
        exercise.id,
        exercise.name,
        exercise.muscleGroup,
        seededAt,
      );
    }
  });
}

function mapExerciseRow(row: ExerciseRow): Exercise {
  return {
    id: row.id,
    name: row.name,
    muscleGroup: row.muscle_group,
  };
}

async function createExerciseId(
  db: SQLiteDatabase,
  name: string,
  muscleGroup: TargetMuscleGroup,
) {
  const slug = `${slugify(muscleGroup)}-${slugify(name)}`.replace(/^-|-$/g, '') || 'custom-exercise';

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const suffix = attempt === 0 ? '' : `-${Math.random().toString(36).slice(2, 6)}`;
    const id = `custom-${slug}${suffix}`;
    const row = await db.getFirstAsync<CountRow>('SELECT COUNT(*) AS count FROM exercises WHERE id = ?', id);

    if ((row?.count ?? 0) === 0) {
      return id;
    }
  }

  return createId(`custom-${slug}`);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getStartOfWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const daysSinceMonday = (day + 6) % 7;

  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - daysSinceMonday);

  return start;
}

function getStreakDays(loggedAtValues: string[], today: Date) {
  const loggedDays = new Set(
    loggedAtValues.map(value => {
      const date = new Date(value);
      return getDateKey(date);
    }),
  );

  let cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);

  if (!loggedDays.has(getDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);

    if (!loggedDays.has(getDateKey(cursor))) {
      return 0;
    }
  }

  let streak = 0;

  while (loggedDays.has(getDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
