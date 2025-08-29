<script setup lang="js">
import { onMounted } from 'vue'
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.js'
import { storeToRefs } from 'pinia'

/** @typedef {import('@/features/workouts/models/workouts.js').Workout} Workout*/

const workoutsStore = useWorkoutsStore()
const { workoutList } = storeToRefs(workoutsStore)

onMounted(() => {
  workoutsStore.fetchWorkouts()
})
</script>

<template>
  <h1>Workout List</h1>
  <ol>
    <li v-for="workout in workoutList" :key="workout.id">
      {{ workout.name }}
    </li>
  </ol>
</template>

<style scoped></style>
