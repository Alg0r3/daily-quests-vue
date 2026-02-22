import { exercisesTable } from '@/shared/infrastructure/database.js';
import { toNativePromise } from '@/shared/infrastructure/dexie-utils.js';

/** @typedef {import('@/modules/workout/domain/models/exercise.model.d.ts').Exercise} Exercise */
/** @typedef {import('@/modules/workout/application/repositories/exercise.repository.d.ts').ExerciseRepository} ExerciseRepository */

/** @type {ExerciseRepository} */
export const dexieExerciseRepository = {
  findAll() {
    return toNativePromise(
      exercisesTable.filter((exercise) => exercise.archivedAt === null).toArray()
    );
  },

  findById(id) {
    // noinspection JSCheckFunctionSignatures
    return toNativePromise(exercisesTable.get(/** @type UUID */ id));
  },

  save(exercise) {
    return toNativePromise(exercisesTable.add(/** @type Exercise */ exercise));
  },

  update(id, changes) {
    return toNativePromise(exercisesTable.update(/** @type UUID */ id, changes)).then(
      (updatedRecords) => {
        return updatedRecords > 0;
      }
    );
  },
};
