import { defineStore } from 'pinia';
import { workoutsRepository } from '@/features/workouts/repositories/workouts.repository.js';
import { reactive, computed } from 'vue';
import { useAsyncOperation } from '@/features/workouts/composables/useAsyncOperation.js';

/** @typedef {import('@/features/workouts/types').Workout} Workout */

export const useWorkoutsStore = defineStore('workouts', () => {
  const workoutsById = reactive(new Map());

  /** @type {import('vue').ComputedRef<Workout[]>} */
  const workoutList = computed(() => Array.from(workoutsById.values()));

  /** @returns {Promise<Workout[]>} */
  const loadAllOperations = useAsyncOperation({
    operation: async () => {
      const workouts = await workoutsRepository.findAll();

      workoutsById.clear();

      for (const workout of workouts) {
        workoutsById.set(workout.id, workout);
      }

      return workouts;
    },
    onError: (error) => {
      console.error('Error when loading all workouts:', error);
    },
  });

  /**
   * @param {UUID} id
   * @returns {Promise<Workout>}
   */
  const loadOperationById = useAsyncOperation({
    operation: /** @type {(id: UUID) => Promise<Workout>} */ (
      async (id) => {
        const workout = await workoutsRepository.findById(id);

        workoutsById.set(workout.id, workout);

        return workout;
      }
    ),
    onError: (error) => {
      console.error('Error when loading workout by ID:', error);
    },
  });

  /**
   * @param {Omit<Workout, 'id'>} payload
   * @returns {Promise<Workout>}
   */
  const createOperation = useAsyncOperation({
    operation: /** @type {(payload: Omit<Workout, 'id'>) => Promise<Workout>} */ (
      async (payload) => {
        const workout = await workoutsRepository.create(payload);

        workoutsById.set(workout.id, workout);

        return workout;
      }
    ),
    onError: (error) => {
      console.error('Error when creating workout:', error);
    },
  });

  /**
   * @param {UUID} id
   * @returns {Promise<UUID>}
   */
  const removeOperation = useAsyncOperation({
    operation: /** @type {(id: UUID) => Promise<UUID>} */ (
      async (id) => {
        await workoutsRepository.remove(id);

        workoutsById.delete(id);

        return id;
      }
    ),
    onError: (error) => {
      console.error('Error when removing workout:', error);
    },
  });

  return {
    workoutList,
    workoutsById,
    loadAll: loadAllOperations.execute,
    loadById: /** @type {(id: UUID) => Promise<Workout|null>} */ (id) =>
      loadOperationById.execute(id),
    create: /** @type {(payload: Omit<Workout, 'id'>) => Promise<Workout|null>} */ (payload) =>
      createOperation.execute(payload),
    remove: /** @type {(id: UUID) => Promise<UUID|null>} */ (id) => removeOperation.execute(id),
  };
});
