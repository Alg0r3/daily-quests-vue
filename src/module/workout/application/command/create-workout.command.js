import { workoutRepository } from '@/module/workout/infrastructure/repository/workout.repository.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */

/**
 * @param {Omit<Workout, 'id'>} payload
 * @return {Promise<Workout>}
 */
export async function createWorkoutCommand(payload) {
  return await workoutRepository.create(payload);
}
