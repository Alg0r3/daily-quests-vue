import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import { useAsyncOperation } from '@/module/workout/presentation/composable/useAsyncOperation.js';
import { createWorkoutCommand } from '@/module/workout/application/command/create-workout.command.js';
import { removeWorkoutCommand } from '@/module/workout/application/command/remove-workout.command.js';
import { listWorkoutsQuery } from '@/module/workout/application/query/list-workouts.query.js';
import { getWorkoutByIdQuery } from '@/module/workout/application/query/get-workout-by-id.query.js';
import { createExerciseCommand } from '@/module/workout/application/command/create-exercise.command.js';
import { removeExerciseCommand } from '@/module/workout/application/command/remove-exercise.command.js';

/** @typedef {import('@/module/workout/domain/index.ts').Workout} Workout */
/** @typedef {import('@/module/workout/domain/index.ts').Exercise} Exercise */

export const useWorkoutsStore = defineStore('workouts', () => {
  const workoutsById = reactive(new Map());
  const exercisesById = reactive(new Map());

  /** @type {import('vue').ComputedRef<Workout[]>} */
  const workoutList = computed(() => Array.from(workoutsById.values()));

  // -------------------------
  // Workout Operations
  // -------------------------

  /** @returns {Promise<Workout[]>} */
  const loadAllWorkoutsOperation = useAsyncOperation({
    operation: async () => {
      const workouts = await listWorkoutsQuery();

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
  const loadWorkoutByIdOperation = useAsyncOperation({
    operation: /** @type {(id: UUID) => Promise<Workout>} */ (
      async (id) => {
        const workout = await getWorkoutByIdQuery(id);

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
  const createWorkoutOperation = useAsyncOperation({
    operation: /** @type {(payload: Omit<Workout, 'id'>) => Promise<Workout>} */ (
      async (payload) => {
        const workout = await createWorkoutCommand(payload);

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
  const removeWorkoutOperation = useAsyncOperation({
    operation: /** @type {(id: UUID) => Promise<UUID>} */ (
      async (id) => {
        await removeWorkoutCommand(id);

        workoutsById.delete(id);

        return id;
      }
    ),
    onError: (error) => {
      console.error('Error when removing workout:', error);
    },
  });

  // -------------------------
  // Exercise Operations
  // -------------------------

  /**
   * @param {Omit<Exercise, 'id'>} payload
   * @returns {Promise<Exercise>}
   */
  const createExerciseOperation = useAsyncOperation({
    operation: /** @type {(payload: Omit<Exercise, 'id'>) => Promise<Exercise>} */ (
      async (payload) => {
        const exercise = await createExerciseCommand(payload);

        exercisesById.set(exercise.id, exercise);

        return exercise;
      }
    ),
    onError: (error) => {
      console.error('Error when creating exercise:', error);
    },
  });

  /**
   * @param {UUID} id
   * @returns {Promise<UUID>}
   */
  const removeExerciseOperation = useAsyncOperation({
    operation: /** @type { (id: UUID) => Promise<UUID>} */ (
      async (id) => {
        await removeExerciseCommand(id);

        exercisesById.delete(id);

        return id;
      }
    ),
    onError: (error) => {
      console.error('Error when removing exercise:', error);
    },
  });

  return {
    // State
    workoutList,
    workoutsById,

    // Action
    loadAllWorkouts: loadAllWorkoutsOperation.execute,
    loadWorkoutById: /** @type {(id: UUID) => Promise<Workout|null>} */ (id) =>
      loadWorkoutByIdOperation.execute(id),
    createWorkout: /** @type {(payload: Omit<Workout, 'id'>) => Promise<Workout|null>} */ (
      payload
    ) => createWorkoutOperation.execute(payload),
    removeWorkout: /** @type {(id: UUID) => Promise<UUID|null>} */ (id) =>
      removeWorkoutOperation.execute(id),
    createExercise: /** @type {(payload: Omit<Exercise, 'id'>) => Promise<Exercise|null>} */ (
      payload
    ) => createExerciseOperation.execute(payload),
    removeExercise: /** @type {(id: UUID) => Promise<UUID|null>} */ (id) =>
      removeExerciseOperation.execute(id),
  };
});
