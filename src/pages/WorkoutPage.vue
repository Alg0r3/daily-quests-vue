<script setup lang="js">
import WorkoutForm from '@/features/workouts/components/WorkoutForm.vue';
import WorkoutList from '@/features/workouts/components/WorkoutList.vue';
import { ref } from 'vue';

const isFormVisible = ref(false);

/** @type {import('vue').Ref<HTMLButtonElement|null>} */
const createButton = ref(null);

function openForm() {
  isFormVisible.value = true;
}

function closeForm() {
  isFormVisible.value = false;

  const element = createButton.value;

  if (element) {
    element.focus();
  }
}
</script>

<template>
  <h1>My Workouts</h1>

  <button
    type="button"
    ref="createButton"
    @click="openForm"
    :aria-expanded="isFormVisible"
    aria-controls="create-workout"
  >
    Create a workout
  </button>

  <Transition name="fade">
    <section id="create-workout" v-if="isFormVisible">
      <WorkoutForm @created="closeForm" @cancelled="closeForm" />
    </section>
  </Transition>

  <WorkoutList />
</template>

<style scoped></style>
