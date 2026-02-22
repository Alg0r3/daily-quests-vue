import { workoutSessionsTable } from '@/shared/infrastructure/database.js';
import { toNativePromise } from '@/shared/infrastructure/dexie-utils.js';

/** @typedef {import('@/modules/workout/domain/models/workout-session.model.d.ts').WorkoutSession} WorkoutSession */
/** @typedef {import('@/modules/workout/application/repositories/workout-session.repository.d.ts').WorkoutSessionRepository} WorkoutSessionRepository */

/** @type {WorkoutSessionRepository} */
export const dexieWorkoutSessionRepository = {
  findAll() {
    return toNativePromise(
      workoutSessionsTable.filter((workoutSession) => workoutSession.deletedAt === null).toArray()
    );
  },

  findById(id) {
    // noinspection JSCheckFunctionSignatures
    return toNativePromise(workoutSessionsTable.get(/** @type UUID */ id));
  },

  save(workoutSession) {
    return toNativePromise(workoutSessionsTable.add(/** @type WorkoutSession */ workoutSession));
  },

  update(id, changes) {
    return toNativePromise(workoutSessionsTable.update(/** @type UUID */ id, changes)).then(
      (updatedRecords) => {
        return updatedRecords > 0;
      }
    );
  },
};
