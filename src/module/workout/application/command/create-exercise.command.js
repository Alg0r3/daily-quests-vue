import { exerciseRepository } from '@/module/workout/infrastructure/repository/exercise.repository.js';

/** @typedef {import('@/module/workout/domain/index.ts').Exercise} Exercise */

/**
 * @param {Omit<Exercise, 'id'>} payload
 * @return {Promise<Exercise>}
 */
export async function createExerciseCommand(payload) {
  return await exerciseRepository.create(payload);
}
