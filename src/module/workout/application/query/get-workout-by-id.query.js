import { workoutRepository } from '@/module/workout/infrastructure/repository/workout.repository.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */

/**
 * @param {UUID} workoutId
 * @return {Promise<Workout>}
 */
export async function getWorkoutByIdQuery(workoutId) {
  return await workoutRepository.findById(workoutId);
}
