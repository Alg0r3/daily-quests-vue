/**
 * @typedef {{ id: UUID }} ItemWithId
 */

/**
 * @typedef {object} UseListDeletionFocusOptions
 * @property {() => void} onListBecameEmpty Callback when the list becomes empty after deletion.
 */

/**
 * @typedef {object} UseListDeletionFocusReturn
 * @property {(id: UUID) => boolean} isDeleting
 * @property {(id: UUID) => void} markDeleting
 * @property {(id: UUID) => void} unmarkDeleting
 * @property {(id: UUID, element: Element|import('vue').ComponentPublicInstance|null) => void} setDeleteButtonRef
 * @property {(deleteId: UUID, previousIndex: number, list: Array<ItemWithId>) => Promise<void>} focusNeighbourAfterRemoval
 */

import { nextTick, onBeforeUnmount, reactive } from 'vue';

/**
 * Manages deletion UX for list rows: disabling items during selection and restoring focus to the
 * next/previous item delete button after removal.
 * @param {UseListDeletionFocusOptions} options
 * @returns {UseListDeletionFocusReturn}
 */
export function useListDeletionFocus(options) {
  const { onListBecameEmpty } = options;

  const deletingIds = reactive(new Set());

  /** @type {Record<UUID, HTMLButtonElement|null>} */
  const deleteButtonById = Object.create(null);

  /**
   * @param {UUID} id
   * @returns {boolean}
   */
  function isDeleting(id) {
    return deletingIds.has(id);
  }

  /**
   * @param {UUID} id
   * @returns {void}
   */
  function markDeleting(id) {
    deletingIds.add(id);
  }

  /**
   * @param {UUID} id
   * @returns {void}
   */
  function unmarkDeleting(id) {
    deletingIds.delete(id);
  }

  /**
   * @param {UUID} id
   * @param {Element|import('vue').ComponentPublicInstance|null} element
   * @returns {void}
   */
  function setDeleteButtonRef(id, element) {
    if (element instanceof HTMLButtonElement) {
      deleteButtonById[id] = element;
    } else {
      delete deleteButtonById[id];
    }
  }

  /**
   * @param {UUID} deleteId
   * @param {number} previousIndex
   * @param {Array<ItemWithId>} list
   * @returns {Promise<void>}
   */
  async function focusNeighbourAfterRemoval(deleteId, previousIndex, list) {
    await nextTick();

    if (list.length === 0) {
      onListBecameEmpty();

      // Ensure we drop the stale reference for the removed item
      delete deleteButtonById[deleteId];

      return;
    }

    const nextCandidate = list[previousIndex]?.id ?? null;
    const previousCandidate = list[previousIndex - 1]?.id ?? null;

    const targetButton =
      (nextCandidate && deleteButtonById[nextCandidate]) ||
      (previousCandidate && deleteButtonById[previousCandidate]) ||
      null;

    targetButton?.focus();

    // Drop stale reference for the removed item
    delete deleteButtonById[deleteId];
  }

  // Cleaning on a component unmount
  onBeforeUnmount(() => {
    deletingIds.clear();

    for (const id in deleteButtonById) {
      delete deleteButtonById[id];
    }
  });

  return {
    isDeleting,
    markDeleting,
    unmarkDeleting,
    setDeleteButtonRef,
    focusNeighbourAfterRemoval,
  };
}
