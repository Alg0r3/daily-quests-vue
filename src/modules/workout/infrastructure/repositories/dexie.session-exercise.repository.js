import { sessionExercisesTable } from '@/shared/infrastructure/database.js';
import { toNativePromise } from '@/shared/infrastructure/dexie-utils.js';

/** @typedef {import('@/modules/workout/domain/models/session-exercise.model.d.ts').SessionExercise} SessionExercise */
/** @typedef {import('@/modules/workout/application/repositories/session-exercise.repository.d.ts').SessionExerciseRepository} SessionExerciseRepository */

/** @type {SessionExerciseRepository} */
export const dexieSessionExerciseRepository = {
  findByWorkoutSessionId(workoutSessionId) {
    return toNativePromise(
      sessionExercisesTable
        .where('workoutSessionId')
        .equals(/** @type UUID */ workoutSessionId)
        .filter((sessionExercise) => sessionExercise.deletedAt === null)
        .sortBy('sortIndex')
    );
  },

  save(sessionExercise) {
    return toNativePromise(sessionExercisesTable.add(/** @type SessionExercise */ sessionExercise));
  },

  update(id, changes) {
    return toNativePromise(sessionExercisesTable.update(/** @type UUID */ id, changes)).then(
      (updatedRecords) => {
        return updatedRecords > 0;
      }
    );
  },
};
