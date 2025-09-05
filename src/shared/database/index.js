import Dexie from 'dexie';
import { workoutsTable } from '@/features/workouts/tables/workouts.table.js';
import { exercisesTable } from '@/features/workouts/tables/exercises.table.js';
import { movementsTable } from '@/features/workouts/tables/movements.table.js';
import { setsTable } from '@/features/workouts/tables/sets.table.js';

/** @typedef {import('@/features/workouts/types').Workout} Workout */
/** @typedef {import('@/features/workouts/types').Exercise} Exercise */

export const database = new Dexie('database');

database.version(1).stores({
  ...workoutsTable.schema,
  ...exercisesTable.schema,
  ...movementsTable.schema,
  ...setsTable.schema,
});

/** @type {Dexie.Table<Workout, string>} */
export const workoutsDB = database.table('workouts');

/** @type {Dexie.Table<Exercise, string>} */
export const exercisesDB = database.table('exercises');
