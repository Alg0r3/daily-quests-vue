<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { useWorkoutsStore } from '@/module/workout/presentation/store/workout.store.js';

const props = defineProps({
  workoutId: {
    type: /** @type {UUID} */ String,
    required: true,
  },
});

const emits = defineEmits(['created', 'cancelled']);

const workoutStore = useWorkoutsStore();

const name = ref('');

/** @type {import('vue').Ref<HTMLInputElement|null>} */
const firstInput = ref(null);

async function onsubmit() {
  await workoutStore.createExercise({
    workoutId: props.workoutId,
    name: name.value,
  });

  name.value = '';
  emits('created');
}

onMounted(async () => {
  // Ensure DOM is updated before focusing on the first input
  await nextTick();

  const element = firstInput.value;

  if (element) {
    element.focus();
  }
});
</script>

<template>
  <h2>New exercise</h2>
  <form @submit.prevent="onsubmit" @keyup.esc="emits('cancelled')">
    <label for="name">Name</label>
    <input id="name" type="text" placeholder="Type a name" ref="firstInput" v-model.trim="name" />
    <button type="submit">Create</button>
    <button type="button" @click="emits('cancelled')">Cancel</button>
  </form>
</template>

<style scoped></style>
