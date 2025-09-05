import { workoutsDB } from '@/shared/database/index.js';
import workoutData from '@/features/workouts/fixtures/workouts.json';
import { v7 as uuidv7 } from 'uuid';

/** @typedef {import('@/features/workouts/types').Workout} Workout */

async function ensureSeed() {
  const count = await workoutsDB.count();

  if (count === 0) {
    await workoutsDB.bulkAdd(workoutData);
  }
}

export async function getWorkouts() {
  await ensureSeed();

  return workoutsDB.toArray();
}

/** @param {Omit<Workout, 'id'>} payload */
export async function createWorkout(payload) {
  /** @type {Workout} */
  const workout = {
    id: uuidv7(),
    name: payload.name,
  };

  await workoutsDB.add(workout);

  return workout;
}

/** @param {UUID} id */
export async function deleteWorkout(id) {
  await workoutsDB.delete(id);
}
