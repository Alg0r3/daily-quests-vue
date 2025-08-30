import { defineStore } from 'pinia'
import { getWorkouts, createWorkout, deleteWorkout } from '@/features/workouts/repositories/workouts.js'
import { reactive, computed } from 'vue'

export const useWorkoutsStore = defineStore('workouts', () => {
  const workoutsById = reactive(new Map())
  const workoutList = computed(() => Array.from(workoutsById.values()))

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

  async function removeWorkout(id) {
    await deleteWorkout(id)

    workoutsById.delete(id)
  }

  return { workoutList, fetchWorkouts, addWorkout, removeWorkout }
})
