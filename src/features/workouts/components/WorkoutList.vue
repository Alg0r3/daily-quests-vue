<script setup lang="js">
import { onMounted } from 'vue';
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.store.js';
import { storeToRefs } from 'pinia';
import WorkoutDetail from '@/features/workouts/components/WorkoutDetail.vue';

const workoutsStore = useWorkoutsStore();
const { workoutList } = storeToRefs(workoutsStore);

/** @param {UUID} id */
async function deleteWorkout(id) {
  await workoutsStore.remove(id);
}

onMounted(() => {
  workoutsStore.loadAll();
});
</script>

<template>
  <h2>Workout List</h2>
  <ol>
    <li v-for="workout in workoutList" :key="workout.id">
      {{ workout.name }}
      <WorkoutDetail :workout-id="workout.id" />
      <i @click="deleteWorkout(workout.id)">x</i>
    </li>
  </ol>
</template>

<style scoped></style>
