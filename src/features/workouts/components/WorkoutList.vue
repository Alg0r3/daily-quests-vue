<script setup lang="js">
import { ref, reactive, onMounted, nextTick } from 'vue';
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
/** @type {import('vue').Ref<Error|null>} */
const error = ref(null);

/** @type {import('vue').Ref<UUID|null>} */
const expandedWorkoutId = ref(null);
/** @type {import('vue').Ref<Record<UUID, HTMLButtonElement|null>>} */
const expandButtonById = ref({});

const deletingIds = reactive(new Set());
/** @type {import('vue').Ref<Record<UUID, HTMLButtonElement|null>>} */
const deleteButtonById = ref({});

/** @type {Emit} */
const emit = defineEmits(['creation-needed', 'deleted', 'loading-failed']);

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
  const index = workoutList.value.findIndex((workout) => workout.id === id);
  const workout = workoutList.value[index];

  if (!workout) {
    console.warn(`Workout not found in list. Skipping delete confirmation.`);
    return;
  }

  // TODO: Improve this
  if (!confirm(`Are you sure you want to delete "${workout.name}" ?`)) return;

  if (deletingIds.has(id)) return;

  deletingIds.add(id);

  try {
    await workoutsStore.remove(id);

    const wasExpanded = isExpanded(id);

    // If we delete the expanded workout, close it and manage focus
    if (wasExpanded) {
      expandedWorkoutId.value = null;
    }

    emit('deleted', { id, name: workout.name });

    // After Vue updates the DOM, move focus
    await nextTick();

    if (workoutList.value.length > 0) {
      const nextId = workoutList.value[index]?.id;
      const prevId = workoutList.value[index - 1]?.id;

      const target =
        (nextId && deleteButtonById.value[nextId]) ||
        (prevId && deleteButtonById.value[prevId]) ||
        null;

      target?.focus();
    } else {
      emit('creation-needed');
    }
  } catch (storeError) {
    console.error('Failed to delete workout.', storeError);
    // TODO: Improve this
    alert('Failed to delete workout. Please, try again.');
  } finally {
    deletingIds.delete(id);
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

/**
 * @param {UUID} id
 * @param {Element|import('vue').ComponentPublicInstance|null} element
 * @returns {void}
 */
function setDeleteButtonRef(id, element) {
  if (element instanceof HTMLButtonElement) {
    deleteButtonById.value[id] = element;
  } else {
    delete deleteButtonById.value[id];
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
              :disabled="deletingIds.has(workout.id)"
              :aria-busy="deletingIds.has(workout.id)"
              :aria-label="
                deletingIds.has(workout.id)
                  ? `Deleting ${workout.name}...`
                  : `Delete ${workout.name}`
              "
            >
              {{ deletingIds.has(workout.id) ? 'Deleting...' : 'Delete' }}
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
