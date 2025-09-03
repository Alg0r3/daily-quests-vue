import Dexie from 'dexie';
import { workoutsTable } from '@/features/workouts/tables/workouts.table.js';
import { exercisesTable } from '@/features/workouts/tables/exercises.table.js';
import { movementsTable } from '@/features/workouts/tables/movements.table.js';
import { setsTable } from '@/features/workouts/tables/sets.table.js';

export const database = new Dexie('database');

database.version(1).stores({
  ...workoutsTable.schema,
  ...exercisesTable.schema,
  ...movementsTable.schema,
  ...setsTable.schema,
});
