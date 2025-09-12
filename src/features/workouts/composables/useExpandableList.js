import { nextTick, onBeforeUnmount, ref } from 'vue';

/**
 * @typedef {object} UseExpandableListReturn
 * @property {(id: UUID) => boolean} isExpanded
 * @property {(id: UUID) => void} forceCollapse
 * @property {(id: UUID, element: Element|import('vue').ComponentPublicInstance|null) => void} setExpandButtonRef
 * @property {(id: UUID) => Promise<void>} toggleExpand
 */

/**
 * Manages expandable list functionality: storing the currently expanded item and managing focus
 * @returns {UseExpandableListReturn}
 */
export function useExpandableList() {
  /** @type {import('vue').Ref<UUID | null>} */
  const expandItemId = ref(null);

  /** @type {import('vue').Ref<Record<UUID, HTMLButtonElement|null>>} */
  const expandButtonById = ref({});

  /**
   * Check if a specific item is expanded
   * @param {UUID} id
   * @returns {boolean}
   */
  function isExpanded(id) {
    return expandItemId.value === id;
  }

  /**
   * @param {UUID} id
   * @returns {void}
   */
  function forceCollapse(id) {
    if (isExpanded(id)) {
      expandItemId.value = null;
    }

    // Also clean up the button reference
    delete expandButtonById.value[id];
  }

  /**
   * Store a reference to the button that expands a specific item for focus management.
   * @param {UUID} id - The ID of the item to expand.
   * @param {Element|import('vue').ComponentPublicInstance|null} element - The button element.
   * @returns {void}
   */
  function setExpandButtonRef(id, element) {
    if (element instanceof HTMLButtonElement) {
      expandButtonById.value[id] = element;
    } else {
      // Clean up the reference when the element is deleted
      delete expandButtonById.value[id];
    }
  }

  /**
   * Toggle the expanded state of a specific item.
   * When collapsing, the focus returns to the button that was expanded.
   * When expanding, the focus moves to the expanded item (handled by the caller).
   * @param {UUID} id
   * @returns {Promise<void>}
   */
  async function toggleExpand(id) {
    if (isExpanded(id)) {
      // Collapse
      expandItemId.value = null;

      await nextTick();

      // Focus on the button that was expanded
      expandButtonById.value[id]?.focus();

      return;
    }

    // Expand (focus management handled by the caller)
    expandItemId.value = id;

    await nextTick();
  }

  // Cleanup on component unmount
  onBeforeUnmount(() => {
    expandItemId.value = null;

    for (const id in expandButtonById.value) {
      delete expandButtonById.value[id];
    }
  });

  return { isExpanded, forceCollapse, setExpandButtonRef, toggleExpand };
}
