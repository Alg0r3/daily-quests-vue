import { defineStore } from 'pinia';
import { exercisesRepository } from '@/features/workouts/repositories/exercises.repository.js';
import { reactive, computed } from 'vue';

/** @typedef {import('@/features/workouts/types').Exercise} Exercise */

export const useExercisesStore = defineStore('exercises', () => {
  const exercisesById = reactive(new Map());

  /** @type {import('vue').ComputedRef<Exercise[]>} */
  const exerciseList = computed(() => Array.from(exercisesById.values()));

  /**
   *
   */
  async function loadAll() {
    const exercises = await exercisesRepository.findAll();

    exercisesById.clear();

    for (const exercise of exercises) {
      exercisesById.set(exercise.id, exercise);
    }
  }

  /** @param {Omit<Exercise, 'id'>} payload */
  async function create(payload) {
    const exercise = await exercisesRepository.create(payload);

    exercisesById.set(exercise.id, exercise);
  }

  /** @param {UUID} id */
  async function remove(id) {
    await exercisesRepository.remove(id);

    exercisesById.delete(id);
  }

  return { exerciseList, loadAll, create, remove };
});
