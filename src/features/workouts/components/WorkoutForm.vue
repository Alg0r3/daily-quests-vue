<script setup lang="js">
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.js'
import { ref } from 'vue'

const workouts = useWorkoutsStore()
const name = ref('')

async function onSubmit() {
  await workouts.addWorkout({ name: name.value })
  name.value = ''
}
</script>

<template>
  <h1>Workout Form</h1>
  <form @submit.prevent="onSubmit">
    <label for="name">Name</label>
    <input id="name" type="text" placeholder="Type a name" v-model.trim="name" />
    <button type="submit">Add workout</button>
  </form>
</template>

<style scoped></style>
