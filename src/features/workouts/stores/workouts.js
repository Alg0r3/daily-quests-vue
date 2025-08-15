import { defineStore } from 'pinia'
import { getWorkouts} from '@/features/workouts/repository/workouts.js'
import { ref, computed } from 'vue'

export const useWorkoutsStore = defineStore('workouts', () => {
  // -- Public state -- //
  const workoutsById = ref(new Map())

  // -- Public getters -- //
  const workoutList = computed(() => Array.from(workoutsById.value.values()))

  // -- Actions -- //
  async function fetchWorkouts() {
    const workouts = await getWorkouts()

    for (const workout of workouts) {
      workoutsById.value.set(workout.id, workout)
    }
  }

  return { workoutList, fetchWorkouts }
})
