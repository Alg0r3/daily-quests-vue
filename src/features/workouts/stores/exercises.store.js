import { defineStore } from 'pinia';
import {
  getExercises,
  createExercise,
  deleteExercise,
} from '@/features/workouts/repositories/exercises.repository.js';
import { reactive, computed } from 'vue';

/** @typedef {import('@/features/workouts/types').Exercise} Exercise */

export const useExercisesStore = defineStore('exercises', () => {
  const exercisesById = reactive(new Map());

  /** @type {import('vue').ComputedRef<Exercise[]>} */
  const exerciseList = computed(() => Array.from(exercisesById.values()));

  async function fetchExercises() {
    const exercises = await getExercises();

    exercisesById.clear();

    for (const exercise of exercises) {
      exercisesById.set(exercise.id, exercise);
    }
  }

  /** @param {Omit<Exercise, 'id'>} payload */
  async function addExercise(payload) {
    const exercise = await createExercise(payload);

    exercisesById.set(exercise.id, exercise);
  }

  /** @param {UUID} id */
  async function removeExercise(id) {
    await deleteExercise(id);

    exercisesById.delete(id);
  }

  return { exerciseList, fetchExercises, addExercise, removeExercise };
});
