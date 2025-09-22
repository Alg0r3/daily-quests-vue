import { defineStore } from 'pinia';
import { exercisesRepository } from '@/features/workouts/repositories/exercises.repository.js';
import { computed, reactive } from 'vue';
import { useAsyncOperation } from '@/features/workouts/composables/useAsyncOperation.js';

/** @typedef {import('@/features/workouts/types').Exercise} Exercise */

export const useExercisesStore = defineStore('exercises', () => {
  /** @type {Map<UUID, Exercise>} */
  const exercisesById = reactive(new Map());

  /** @type import('vue').ComputedRef<Exercise[]> */
  const exerciseList = computed(() => Array.from(exercisesById.values()));

  /**
   * @param {Omit<Exercise, 'id'>} payload
   * @returns {Promise<Exercise>}
   */
  const createOperation = useAsyncOperation({
    operation: /** @type {(payload: Omit<Exercise, 'id'>) => Promise<Exercise>} */ (
      async (payload) => {
        const exercise = await exercisesRepository.create(payload);

        exercisesById.set(exercise.id, exercise);

        return exercise;
      }
    ),
    onError: (error) => {
      console.error('Error when creating exercise:', error);
    },
  });

  return {
    exerciseList,
    create: /** @type {(payload: Omit<Exercise, 'id'>) => Promise<Exercise|null>} */ (payload) =>
      createOperation.execute(payload),
  };
});
