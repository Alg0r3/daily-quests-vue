import { defineStore } from 'pinia';
import {
  getWorkouts,
  createWorkout,
  deleteWorkout,
} from '@/features/workouts/repositories/workouts.js';
import { reactive, computed } from 'vue';

/** @typedef {import('@/features/workouts/types').Workout} Workout */

export const useWorkoutsStore = defineStore('workouts', () => {
  const workoutsById = reactive(new Map());

  /** @type {import('vue').ComputedRef<Workout[]>} */
  const workoutList = computed(() => Array.from(workoutsById.values()));

  async function fetchWorkouts() {
    const workouts = await getWorkouts();

    workoutsById.clear();

    for (const workout of workouts) {
      workoutsById.set(workout.id, workout);
    }
  }

  /** @param {Omit<Workout, 'id'>} payload */
  async function addWorkout(payload) {
    const workout = await createWorkout(payload);

    workoutsById.set(workout.id, workout);
  }

  /** @param {UUID} id */
  async function removeWorkout(id) {
    await deleteWorkout(id);

    workoutsById.delete(id);
  }

  return { workoutList, fetchWorkouts, addWorkout, removeWorkout };
});
