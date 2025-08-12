<script setup lang="js">
import { onMounted, ref } from 'vue'
import { getWorkouts } from '../api/workouts.api.js'

/** @typedef {id: string, name: string} Workout */

const workouts = ref(/** @type {Workout[]} */[])

onMounted(async () => {
  workouts.value = await getWorkouts()
})
</script>

<template>
  <h1>Workout List</h1>
  <ol>
    <li v-for="workout in workouts" :key="workout.id">
      {{ workout.name }}
    </li>
  </ol>
</template>

<style scoped></style>
