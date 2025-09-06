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

export async function findAll() {
  await ensureSeed();

  return workoutsDB.toArray();
}

/** @param {UUID} id */
export async function findById(id) {
  const workout = await workoutsDB.get(id);

  if (!workout) {
    const error = new Error(`Workout not found with ID: ${id}`);
    error.name = 'NotFoundError';

    throw error;
  }

  return workout;
}

/** @param {Omit<Workout, 'id'>} payload */
export async function create(payload) {
  /** @type {Workout} */
  const workout = {
    id: uuidv7(),
    name: payload.name,
  };

  await workoutsDB.add(workout);

  return workout;
}

/** @param {UUID} id */
export async function remove(id) {
  await workoutsDB.delete(id);
}
