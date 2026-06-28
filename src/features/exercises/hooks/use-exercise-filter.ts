import { useMemo, useState } from 'react';
import { MUSCLE_GROUPS } from '../data/exercises';
import type { Exercise, ExerciseSection, MuscleGroup } from '../types';

export function useExerciseFilter(exercises: Exercise[]) {
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>('All');

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);

    if (nextQuery.length > 0) {
      setSelectedGroup('All');
    }
  }

  const sections = useMemo<ExerciseSection[]>(() => {
    const q = query.trim().toLowerCase();

    const filtered = exercises.filter(exercise => {
      const matchesQuery = q === '' || exercise.name.toLowerCase().includes(q);
      const matchesGroup =
        selectedGroup === 'All' || exercise.muscleGroup === selectedGroup;
      return matchesQuery && matchesGroup;
    });

    if (selectedGroup !== 'All') {
      return filtered.length > 0 ? [{ title: selectedGroup, data: filtered }] : [];
    }

    return (MUSCLE_GROUPS as readonly MuscleGroup[])
      .filter(g => g !== 'All')
      .map(group => ({
        title: group,
        data: filtered.filter(e => e.muscleGroup === group),
      }))
      .filter(section => section.data.length > 0);
  }, [exercises, query, selectedGroup]);

  return { query, setQuery: handleQueryChange, selectedGroup, setSelectedGroup, sections };
}
