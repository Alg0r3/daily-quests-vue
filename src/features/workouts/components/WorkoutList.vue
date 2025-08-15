<script setup lang="js">
import { onMounted } from 'vue'
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.js'
import { storeToRefs } from 'pinia'

/** @typedef {id: string, name: string} Workout */

const workoutsStore = useWorkoutsStore()
const { workoutList } = storeToRefs(workoutsStore)

onMounted(async () => {
  await workoutsStore.fetchWorkouts()
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
