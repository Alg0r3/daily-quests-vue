<script setup lang="js">
import { useWorkoutsStore } from '@/module/workout/presentation/store/workout.store.js';
import { storeToRefs } from 'pinia';
import { useAsyncOperation } from '@/module/workout/presentation/composable/useAsyncOperation.js';
import { useExpandableList } from '@/module/workout/presentation/composable/useExpandableList.js';
import { useListDeletionFocus } from '@/module/workout/presentation/composable/useListDeletionFocus.js';
import WorkoutDetail from '@/module/workout/presentation/component/WorkoutDetail.vue';

/** @typedef {{
 *  (event: 'creation-needed'): void;
 *  (event: 'deleted', payload: { id: UUID, name: string }): void;
 *  (event: 'loading-failed', error: Error): void;
 * }} Emit
 */

const workoutsStore = useWorkoutsStore();
const { workoutList } = storeToRefs(workoutsStore);

/** @type {Emit} */
const emit = defineEmits(['creation-needed', 'deleted', 'loading-failed']);

const {
  isLoading,
  error,
  execute: load,
} = useAsyncOperation({
  operation: () => workoutsStore.loadAll(),
  onError: (loadError) => {
    emit('loading-failed', loadError);
    console.error('Failed to load workouts.', loadError);
  },
  suppressErrors: true,
  executeOnMount: true,
});
const { isExpanded, forceCollapse, setExpandButtonRef, toggleExpand } = useExpandableList();
const { isDeleting, markDeleting, unmarkDeleting, setDeleteButtonRef, focusNeighbourAfterRemoval } =
  useListDeletionFocus({ onListBecameEmpty: () => emit('creation-needed') });

/**
 * @param {UUID} id - The ID of the workout to toggle details for.
 * @returns {Promise<void>}
 */
async function toggleDetails(id) {
  await toggleExpand(id);
}

/**
 * @param {UUID} id
 * @returns {Promise<void>}
 */
async function deleteWorkout(id) {
  const indexBeforeRemoval = workoutList.value.findIndex((workout) => workout.id === id);
  const workout = workoutList.value[indexBeforeRemoval];

  if (!workout) {
    console.warn(`Workout not found in list. Skipping delete confirmation.`);
    return;
  }

  // TODO: Improve this
  if (!confirm(`Are you sure you want to delete "${workout.name}" ?`)) return;

  if (isDeleting(id)) return;

  markDeleting(id);

  try {
    await workoutsStore.remove(id);

    // If we're deleting the currently expanded item, collapse it
    forceCollapse(id);

    emit('deleted', { id, name: workout.name });

    // Let the composable decide where to move focus next
    await focusNeighbourAfterRemoval(id, indexBeforeRemoval, workoutList.value);
  } catch (storeError) {
    console.error('Failed to delete workout.', storeError);
    // TODO: Improve this
    alert('Failed to delete workout. Please, try again.');
  } finally {
    unmarkDeleting(id);
  }
}
</script>

<template>
  <section aria-labelledby="workout-list-title">
    <h2 id="workout-list-title">Workout List</h2>

    <!-- Loading/error states -->
    <p role="status" v-if="isLoading">Loading workouts...</p>
    <div role="alert" v-else-if="error">
      <p>{{ error.message || 'Could not load workouts.' }}</p>
      <button type="button" @click="load">Retry</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="workoutList.length === 0" aria-live="polite">
      <p>No workouts yet.</p>
      <button type="button" @click="emit('creation-needed')">Create your first workout</button>
    </div>

    <!-- List with expandable items -->
    <div v-else>
      <TransitionGroup name="fade" tag="ol">
        <li v-for="workout in workoutList" :key="workout.id">
          <div class="row">
            <strong :id="`workout-${workout.id}-summary`">{{ workout.name }}</strong>

            <!-- Expand/collapse button with ref management -->
            <button
              type="button"
              class="expand"
              @click="toggleDetails(workout.id)"
              :ref="(element) => setExpandButtonRef(workout.id, element)"
              :aria-expanded="isExpanded(workout.id)"
              :aria-controls="`workout-${workout.id}-details`"
            >
              {{ isExpanded(workout.id) ? 'Hide details' : 'View details' }}
            </button>

            <!-- Delete button with deletion state -->
            <button
              type="button"
              title="Delete"
              @click="deleteWorkout(workout.id)"
              :ref="(element) => setDeleteButtonRef(workout.id, element)"
              :disabled="isDeleting(workout.id)"
              :aria-busy="isDeleting(workout.id)"
              :aria-label="
                isDeleting(workout.id) ? `Deleting ${workout.name}...` : `Delete ${workout.name}`
              "
            >
              {{ isDeleting(workout.id) ? 'Deleting...' : 'Delete' }}
            </button>
          </div>

          <!-- Expandable details -->
          <Transition name="fade">
            <WorkoutDetail
              class="details"
              @close="toggleDetails(workout.id)"
              v-if="isExpanded(workout.id)"
              :id="`workout-${workout.id}-details`"
              :workout-id="workout.id"
              :aria-labelledby="`workout-${workout.id}-summary`"
              autofocus
            />
          </Transition>
        </li>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.5rem;
  align-items: center;
}

.details {
  margin-block: 0.5rem 1rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
}
</style>
