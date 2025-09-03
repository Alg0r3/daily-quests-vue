<script setup lang="ts">
import WorkoutForm from '@/features/workouts/components/WorkoutForm.vue';
import WorkoutList from '@/features/workouts/components/WorkoutList.vue';
import { ref } from 'vue';

const isFormVisible = ref(false);

function toggleFormVisibility() {
  isFormVisible.value = !isFormVisible.value;
}
</script>

<template>
  <h1>My Workouts</h1>

  <Transition name="fade">
    <WorkoutForm v-if="isFormVisible" />
  </Transition>

  <button @click="toggleFormVisibility">
    {{ isFormVisible ? 'Cancel' : 'Add workout' }}
  </button>

  <WorkoutList />
</template>

<style scoped></style>
