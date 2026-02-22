import { exerciseSetsTable } from '@/shared/infrastructure/database.js';
import { toNativePromise } from '@/shared/infrastructure/dexie-utils.js';

/** @typedef {import('@/modules/workout/domain/models/exercise-set.model.d.ts').ExerciseSet} ExerciseSet */
/** @typedef {import('@/modules/workout/application/repositories/exercise-set.repository.d.ts').ExerciseSetRepository} ExerciseSetRepository */

/** @type {ExerciseSetRepository} */
export const dexieExerciseSetRepository = {
  findBySessionExerciseId(sessionExerciseId) {
    return toNativePromise(
      exerciseSetsTable
        .where('sessionExerciseId')
        .equals(/** @type UUID */ sessionExerciseId)
        .filter((exerciseSet) => exerciseSet.deletedAt === null)
        .sortBy('sortIndex')
    );
  },

  save(exerciseSet) {
    return toNativePromise(exerciseSetsTable.add(/** @type ExerciseSet */ exerciseSet));
  },

  update(id, changes) {
    return toNativePromise(exerciseSetsTable.update(/** @type UUID */ id, changes)).then(
      (updatedRecords) => {
        return updatedRecords > 0;
      }
    );
  },
};
