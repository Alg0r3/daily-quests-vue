import { workoutRepository } from '@/module/workout/infrastructure/repository/workout.repository.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */

/**
 * @param {UUID} workoutId
 * @return {Promise<UUID>}
 */
export async function removeWorkoutCommand(workoutId) {
  await workoutRepository.remove(workoutId);

  return workoutId;
}
