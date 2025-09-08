import { exercisesDB } from '@/shared/database/index.js';
import { v7 as uuidv7 } from 'uuid';

/** @typedef {import('@/features/workouts/types').Exercise} Exercise */

/** @returns {Promise<Exercise[]>} */
export async function getExercises() {
  return exercisesDB.toArray();
}

/**
 * @param {Omit<Exercise, 'id'>} payload
 * @returns {Promise<Exercise>}
 */
export async function createExercise(payload) {
  /** @type {Exercise} */
  const exercise = {
    id: uuidv7(),
    workoutId: payload.workoutId,
    movementId: payload.movementId,
    notes: payload.notes,
    sets: payload.sets,
  };

  await exercisesDB.add(exercise);

  return exercise;
}

/** @param {UUID} id */
export async function deleteExercise(id) {
  await exercisesDB.delete(id);
}
