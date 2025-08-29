<script setup lang="js">
import WorkoutForm from '@/features/workouts/components/WorkoutForm.vue'
import WorkoutList from '@/features/workouts/components/WorkoutList.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <WorkoutForm />
  <WorkoutList />
  <RouterView />
</template>

<style scoped>
</style>
