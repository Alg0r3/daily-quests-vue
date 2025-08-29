import { defineStore } from 'pinia'
import { getWorkouts, createWorkout } from '@/features/workouts/repositories/workouts.js'
import { reactive, computed } from 'vue'

export const useWorkoutsStore = defineStore('workouts', () => {
  // -- Public state -- //
  const workoutsById = reactive(new Map())

  // -- Public getters -- //
  const workoutList = computed(() => Array.from(workoutsById.values()))

  // -- Actions -- //
  async function fetchWorkouts() {
    const workouts = await getWorkouts()

    for (const workout of workouts) {
      workoutsById.set(workout.id, workout)
    }
  }

  async function addWorkout(payload) {
    const workout = await createWorkout(payload)

    workoutsById.set(workout.id, workout)
  }

  return { workoutList, fetchWorkouts, addWorkout }
})
