import { exerciseRepository } from '@/module/workout/infrastructure/repository/exercise.repository.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */

/**
 * @param {UUID} exerciseId
 * @return {Promise<UUID>}
 */
export async function removeExerciseCommand(exerciseId) {
  await exerciseRepository.remove(exerciseId);

  return exerciseId;
}
