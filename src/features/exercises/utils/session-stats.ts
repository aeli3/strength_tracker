import type { ExerciseSession, ExerciseSet } from '../types';

export function getBestSet(sessions: ExerciseSession[]): ExerciseSet | undefined {
  const sets = sessions.flatMap(session => session.sets);

  if (sets.length === 0) {
    return undefined;
  }

  return sets.reduce((best, set) => (set.weight > best.weight ? set : best), sets[0]);
}

export function getFirstSet(sessions: ExerciseSession[]) {
  return sessions.find(session => session.sets.length > 0)?.sets[0];
}

export function getTopSet(session: ExerciseSession) {
  if (session.sets.length === 0) {
    return undefined;
  }

  return session.sets.reduce((best, set) => (set.weight > best.weight ? set : best), session.sets[0]);
}

export function getVolume(session: ExerciseSession) {
  return session.sets.reduce((total, set) => total + set.weight * set.reps, 0);
}

export function getBestDate(sessions: ExerciseSession[], bestSet?: ExerciseSet) {
  if (!bestSet) {
    return undefined;
  }

  return sessions.find(session => session.sets.some(set => set.id === bestSet.id))?.dateLabel;
}

export function getPrCountThisMonth(sessions: ExerciseSession[]) {
  const now = new Date();
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  return sessions.filter(session => session.isPr && session.loggedAt.startsWith(monthPrefix)).length;
}

export function sortSessions(sessions: ExerciseSession[]) {
  return [...sessions].sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
}

export function formatWeight(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function formatVolume(value: number) {
  return Math.round(value).toLocaleString('en-US');
}

export function formatSessionDate(date: Date) {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) {
    return 'Today';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
