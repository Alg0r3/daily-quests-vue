import Dexie from 'dexie';
import { workoutsSchema } from '@/modules/workouts/infrastructure/database/workouts.schema.js';
import { exercisesSchema } from '@/modules/workouts/infrastructure/database/exercises.schema.js';
import { movementsSchema } from '@/modules/workouts/infrastructure/database/movements.schema.js';
import { setsSchema } from '@/modules/workouts/infrastructure/database/sets.schema.js';

/** @typedef {import('@/modules/workouts/domain/index.ts').Workout} Workout */
/** @typedef {import('@/modules/workouts/domain/index.ts').Exercise} Exercise */

export const database = new Dexie('database');

database.version(1).stores({
  ...workoutsSchema.schema,
  ...exercisesSchema.schema,
  ...movementsSchema.schema,
  ...setsSchema.schema,
});

/** @type {Dexie.Table<Workout, string>} */
export const workoutsDB = database.table('workouts');

/** @type {Dexie.Table<Exercise, string>} */
export const exercisesDB = database.table('exercises');
