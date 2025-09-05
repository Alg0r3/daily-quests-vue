<script setup lang="js">
import { onMounted } from 'vue';
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.js';
import { storeToRefs } from 'pinia';

const workoutsStore = useWorkoutsStore();
const { workoutList } = storeToRefs(workoutsStore);

/** @param {UUID} id */
async function deleteWorkout(id) {
  await workoutsStore.removeWorkout(id);
}

onMounted(() => {
  workoutsStore.fetchWorkouts();
});
</script>

<template>
  <h2>Workout List</h2>
  <ol>
    <li v-for="workout in workoutList" :key="workout.id">
      {{ workout.name }}
      <i @click="deleteWorkout(workout.id)">x</i>
    </li>
  </ol>
</template>

<style scoped></style>
