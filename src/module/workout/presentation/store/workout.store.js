import { defineStore } from 'pinia';
import { workoutRepository } from '@/module/workout/infrastructure/repository/workout.repository.js';
import { reactive, computed } from 'vue';
import { useAsyncOperation } from '@/module/workout/presentation/composable/useAsyncOperation.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */

export const useWorkoutsStore = defineStore('workouts', () => {
  const workoutsById = reactive(new Map());

  /** @type {import('vue').ComputedRef<Workout[]>} */
  const workoutList = computed(() => Array.from(workoutsById.values()));

  /** @returns {Promise<Workout[]>} */
  const loadAllOperations = useAsyncOperation({
    operation: async () => {
      const workouts = await workoutRepository.findAll();

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
        const workout = await workoutRepository.findById(id);

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
        const workout = await workoutRepository.create(payload);

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
        await workoutRepository.remove(id);

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
