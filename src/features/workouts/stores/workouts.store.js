import { defineStore } from 'pinia';
import { workoutsRepository } from '@/features/workouts/repositories/workouts.repository.js';
import { reactive, ref, computed } from 'vue';
import { ensureError } from '@/shared/utils/errors.js';

/** @typedef {import('@/features/workouts/types').Workout} Workout */

export const useWorkoutsStore = defineStore('workouts', () => {
  const workoutsById = reactive(new Map());
  const loading = ref(false);

  /** @type {import('vue').Ref<Error | null>} */
  const error = ref(null);

  /** @type {import('vue').ComputedRef<Workout[]>} */
  const workoutList = computed(() => Array.from(workoutsById.values()));

  async function loadAll() {
    loading.value = true;
    error.value = null;

    try {
      const workouts = await workoutsRepository.findAll();

      workoutsById.clear();

      for (const workout of workouts) {
        workoutsById.set(workout.id, workout);
      }
    } catch (fetchError) {
      console.error('Failed to fetch workouts.', fetchError);

      error.value = ensureError(fetchError);

      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  /** @param {UUID} id */
  async function loadById(id) {
    loading.value = true;
    error.value = null;

    try {
      const workout = await workoutsRepository.findById(id);

      workoutsById.set(workout.id, workout);

      return workout;
    } catch (fetchError) {
      console.error('Failed to fetch workout.', fetchError);

      error.value = ensureError(fetchError);

      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  /** @param {Omit<Workout, 'id'>} payload */
  async function create(payload) {
    loading.value = true;
    error.value = null;

    try {
      const workout = await workoutsRepository.create(payload);

      workoutsById.set(workout.id, workout);
    } catch (fetchError) {
      console.error('Failed to add workout.', fetchError);

      error.value = ensureError(fetchError);

      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  /** @param {UUID} id */
  async function remove(id) {
    loading.value = true;
    error.value = null;

    try {
      await workoutsRepository.remove(id);

      workoutsById.delete(id);
    } catch (fetchError) {
      console.error('Failed to remove workout.', fetchError);

      error.value = ensureError(fetchError);

      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  return {
    workoutList,
    workoutsById,
    loadAll,
    loadById,
    create,
    remove,
  };
});
