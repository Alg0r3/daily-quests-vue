import { defineStore } from 'pinia';
import {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
} from '@/features/workouts/repositories/workouts.repository.js';
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

  async function fetchWorkouts() {
    loading.value = true;
    error.value = null;

    try {
      const workouts = await getWorkouts();

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
  async function fetchWorkout(id) {
    loading.value = true;
    error.value = null;

    try {
      const workout = await getWorkout(id);

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
  async function addWorkout(payload) {
    loading.value = true;
    error.value = null;

    try {
      const workout = await createWorkout(payload);

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
  async function removeWorkout(id) {
    loading.value = true;
    error.value = null;

    try {
      await deleteWorkout(id);

      workoutsById.delete(id);
    } catch (fetchError) {
      console.error('Failed to remove workout.', fetchError);

      error.value = ensureError(fetchError);

      throw fetchError;
    } finally {
      loading.value = false;
    }
  }

  return { workoutList, workoutsById, fetchWorkouts, fetchWorkout, addWorkout, removeWorkout };
});
