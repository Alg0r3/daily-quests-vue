import Dexie from 'dexie';
import { workoutSchema } from '@/module/workout/infrastructure/database/workout.schema.js';
import { exerciseSchema } from '@/module/workout/infrastructure/database/exercise.schema.js';
import { movementSchema } from '@/module/workout/infrastructure/database/movement.schema.js';
import { setSchema } from '@/module/workout/infrastructure/database/set.schema.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */
/** @typedef {import('@/module/workout/domain/index.ts').Exercise} Exercise */

export const database = new Dexie('database');

database.version(1).stores({
  ...workoutSchema.schema,
  ...exerciseSchema.schema,
  ...movementSchema.schema,
  ...setSchema.schema,
});

/** @type {Dexie.Table<Workout, string>} */
export const workoutsDB = database.table('workouts');

/** @type {Dexie.Table<Exercise, string>} */
export const exercisesDB = database.table('exercises');
