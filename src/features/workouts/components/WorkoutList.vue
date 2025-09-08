<script setup lang="js">
import { ref, reactive, onMounted } from 'vue';
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.store.js';
import { storeToRefs } from 'pinia';
import WorkoutDetail from '@/features/workouts/components/WorkoutDetail.vue';
import { ensureError } from '@/shared/utils/errors.js';

/** @typedef {{
 *  (event: 'creation-needed'): void;
 *  (event: 'deleted', payload: { id: UUID, name: string }): void;
 *  (event: 'loading-failed', error: Error): void;
 * }} Emit
 */

const workoutsStore = useWorkoutsStore();
const { workoutList } = storeToRefs(workoutsStore);

const isLoading = ref(false);
/** @type {import('vue').Ref<Error | null>} */
const error = ref(null);
const deletingIds = reactive(new Set());

/** @type {Emit} */
const emit = defineEmits(['creation-needed', 'deleted', 'loading-failed']);

async function load() {
  try {
    isLoading.value = true;
    error.value = null;

    await workoutsStore.loadAll();
  } catch (storeError) {
    error.value = ensureError(storeError);

    emit('loading-failed', error.value);
  } finally {
    isLoading.value = false;
  }
}

/** @param {UUID} id */
async function deleteWorkout(id) {
  const workout = workoutList.value.find((workout) => workout.id === id);

  if (!workout) {
    console.warn(`Workout not found in list. Skipping delete confirmation.`);
    return;
  }

  // TODO: Improve this
  if (!confirm(`Are you sure you want to delete "${workout.name}" ?`)) return;

  deletingIds.add(id);

  try {
    await workoutsStore.remove(id);

    emit('deleted', { id, name: workout.name });
  } catch (storeError) {
    console.error('Failed to delete workout.', storeError);
    // TODO: Improve this
    alert('Failed to delete workout. Please, try again.');
  } finally {
    deletingIds.delete(id);
  }
}

onMounted(load);
</script>

<template>
  <section aria-labelledby="workout-list-title">
    <h2 id="workout-list-title">Workout List</h2>

    <!-- Loading/error -->
    <p role="status" v-if="isLoading">Loading workouts...</p>
    <div role="alert" v-else-if="error">
      <p>{{ error.message || 'Could not load workouts.' }}</p>
      <button type="button" @click="load">Retry</button>
    </div>

    <!-- Empty -->
    <div v-else-if="workoutList.length === 0" aria-live="polite">
      <p>No workouts yet.</p>
      <button type="button" @click="emit('creation-needed')">Create your first workout</button>
    </div>

    <!-- List -->
    <div v-else>
      <TransitionGroup name="fade" tag="ol" aria-live="polite">
        <li v-for="workout in workoutList" :key="workout.id">
          <strong>{{ workout.name }}</strong>
          <!-- TODO: Improve this -->
          <WorkoutDetail :workout-id="workout.id" />
          <button
            type="button"
            title="Delete"
            @click="deleteWorkout(workout.id)"
            :disabled="deletingIds.has(workout.id)"
            :aria-busy="deletingIds.has(workout.id) ? 'true' : 'false'"
            :aria-label="
              deletingIds.has(workout.id) ? `Deleting ${workout.name}...` : `Delete ${workout.name}`
            "
          >
            {{ deletingIds.has(workout.id) ? 'Deleting...' : 'Delete' }}
          </button>
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped></style>
