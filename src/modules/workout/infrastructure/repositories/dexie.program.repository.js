import { programsTable } from '@/shared/infrastructure/database.js';
import { toNativePromise } from '@/shared/infrastructure/dexie-utils.js';

/** @typedef {import('@/modules/workout/domain/models/program.model.d.ts').Program} Program */
/** @typedef {import('@/modules/workout/application/repositories/program.repository.d.ts').ProgramRepository} ProgramRepository */

/** @type {ProgramRepository} */
export const dexieProgramRepository = {
  findAll() {
    return toNativePromise(programsTable.filter((program) => program.deletedAt === null).toArray());
  },

  findById(id) {
    // noinspection JSCheckFunctionSignatures
    return toNativePromise(programsTable.get(/** @type UUID */ id));
  },

  save(program) {
    return toNativePromise(programsTable.add(/** @type Program */ program));
  },

  update(id, changes) {
    return toNativePromise(programsTable.update(/** @type UUID */ id, changes)).then(
      (updatedRecords) => {
        return updatedRecords > 0;
      }
    );
  },
};
