<script setup lang="js">
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.store.js';
import { ref, onMounted, nextTick } from 'vue';

const workoutsStore = useWorkoutsStore();
const name = ref('');

/** @type {import('vue').Ref<HTMLInputElement|null>} */
const firstInput = ref(null);

const emit = defineEmits(['created', 'cancelled']);

async function onSubmit() {
  await workoutsStore.create({ name: name.value });

  name.value = '';
  emit('created');
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
  <h2>New workout</h2>
  <form @submit.prevent="onSubmit" @keyup.esc="emit('cancelled')">
    <label for="name">Name</label>
    <input id="name" type="text" placeholder="Type a name" ref="firstInput" v-model.trim="name" />
    <button type="submit">Create</button>
    <button type="button" @click="emit('cancelled')">Cancel</button>
  </form>
</template>

<style scoped></style>
