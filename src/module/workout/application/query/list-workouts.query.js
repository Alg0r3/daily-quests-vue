import { workoutRepository } from '@/module/workout/infrastructure/repository/workout.repository.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */

/** @returns {Promise<Workout[]>} */
export async function listWorkoutsQuery() {
  return await workoutRepository.findAll();
}
