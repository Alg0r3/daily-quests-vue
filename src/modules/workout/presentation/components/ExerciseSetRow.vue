<script setup lang="js">
import { Badge, InputNumber, Button } from 'primevue';
import { ref } from 'vue';

const { setIndex, defaultWeightKg, defaultReps } = defineProps({
  setIndex: {
    type: Number,
    required: true,
  },
  defaultWeightKg: {
    type: Number,
    required: false,
    default: null,
  },
  defaultReps: {
    type: Number,
    required: false,
    default: null,
  },
});

const emits = defineEmits({
  complete: (payload) => payload,
});

const weightKg = ref(defaultWeightKg);
const reps = ref(defaultReps);
const isDone = ref(false);

function handleToggleDone() {
  if (isDone.value) return;

  isDone.value = true;

  emits('complete', {
    weightKg: weightKg.value,
    reps: reps.value,
  });
}
</script>

<template>
  <div class="flex items-center gap-3 w-full">
    <div class="flex-none w-8 flex justify-center">
      <Badge :value="setIndex" />
    </div>
    <div class="flex-1">
      <InputNumber
        v-model="weightKg"
        placeholder="Weight"
        :suffix="' kg'"
        :min="0"
        :disabled="isDone"
        fluid
      ></InputNumber>
    </div>
    <div class="flex-1">
      <InputNumber
        v-model="reps"
        placeholder="Reps"
        :min="0"
        :disabled="isDone"
        fluid
      ></InputNumber>
    </div>
    <div class="flex-none">
      <Button icon="pi pi-chevron-down" :disabled="isDone" text rounded />
    </div>
    <div class="flex-none">
      <Button
        icon="pi pi-check"
        :severity="isDone ? 'success' : 'secondary'"
        :outlined="!isDone"
        rounded
        @click="handleToggleDone"
      />
    </div>
  </div>
</template>

<style scoped></style>
