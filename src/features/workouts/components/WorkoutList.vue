<script setup lang="js">
import { ref, onMounted, nextTick } from 'vue';
import { useWorkoutsStore } from '@/features/workouts/stores/workouts.store.js';
import { storeToRefs } from 'pinia';
import WorkoutDetail from '@/features/workouts/components/WorkoutDetail.vue';
import { ensureError } from '@/shared/utils/errors.js';
import { useListDeletionFocus } from '@/features/workouts/composables/useListDeletionFocus.js';

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

const { isDeleting, markDeleting, unmarkDeleting, setDeleteButtonRef, focusNeighbourAfterRemoval } =
  useListDeletionFocus({ onListBecameEmpty: () => emit('creation-needed') });

const isLoading = ref(false);
/** @type {import('vue').Ref<Error|null>} */
const error = ref(null);

/** @type {import('vue').Ref<UUID|null>} */
const expandedWorkoutId = ref(null);
/** @type {import('vue').Ref<Record<UUID, HTMLButtonElement|null>>} */
const expandButtonById = ref({});

/** @returns {Promise<void>} */
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

/**
 * @param {UUID} id
 * @returns {boolean}
 */
function isExpanded(id) {
  return expandedWorkoutId.value === id;
}

/**
 * @param {UUID} id
 * @returns {Promise<void>}
 */
async function toggleDetails(id) {
  if (isExpanded(id)) {
    expandedWorkoutId.value = null;

    await nextTick();

    expandButtonById.value[id]?.focus();

    return;
  }

  expandedWorkoutId.value = id;

  await nextTick();
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

    const wasExpanded = isExpanded(id);

    // If we delete the expanded workout, close it and manage focus
    if (wasExpanded) {
      expandedWorkoutId.value = null;
    }

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

/**
 * @param {UUID} id
 * @param {Element|import('vue').ComponentPublicInstance|null} element
 * @returns {void}
 */
function setExpandButtonRef(id, element) {
  if (element instanceof HTMLButtonElement) {
    expandButtonById.value[id] = element;
  } else {
    delete expandButtonById.value[id];
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
      <TransitionGroup name="fade" tag="ol">
        <li v-for="workout in workoutList" :key="workout.id">
          <div class="row">
            <strong :id="`workout-${workout.id}-summary`">{{ workout.name }}</strong>

            <!-- Expand/collapse -->
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

            <!-- Delete -->
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

          <!-- Lazy-mounted details -->
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
