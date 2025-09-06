<script setup lang="js">
import { defineProps, computed } from 'vue';
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.store.js';

const props = defineProps({
  workoutId: {
    required: true,
  },
});

const workoutsStore = useWorkoutsStore();
const workout = computed(() => workoutsStore.workoutsById.get(props.workoutId));
</script>

<template>
  <h2>Workout Detail</h2>
  <p>Name: {{ workout.name }}</p>
</template>

<style scoped></style>
