import { onMounted, ref } from 'vue';
import { ensureError } from '@/shared/utils/errors.js';

/**
 * @template T
 * @typedef {object} UseAsyncOperationOptions
 * @property {() => Promise<T>} operation - The asynchronous operation to execute.
 * @property {(result: Awaited<T>) => void} [onSuccess] - Callback function to be called on successful execution.
 * @property {(error: Error) => void} [onError] - Callback function to be called on error.
 * @property {boolean} [executeOnMount=false] - Whether to execute the operation on component mount.
 */

/**
 * @template T
 * @typedef {object} UseAsyncOperationReturn
 * @property {import('vue').Ref<boolean>} isLoading - Indicates whether the operation is loading.
 * @property {import('vue').Ref<Error | null>} error - Holds any error that occurred during the operation.
 * @property {import('vue').Ref<Awaited<T> | null>} data - Holds the result of the operation.
 * @property {() => Promise<Awaited<T>|null>} execute - Executes the operation.
 */

/**
 * Manages asynchronous operations with loading state, error handling, and data management.
 * @template T
 * @param {UseAsyncOperationOptions<T>} options
 * @returns {UseAsyncOperationReturn<T>}
 */
export function useAsyncOperation(options) {
  /** @typedef {Awaited<ReturnType<typeof operation>>} OperationResult */

  const { operation, onSuccess, onError, executeOnMount = false } = options;

  const isLoading = ref(false);

  /** @type {import('vue').Ref<Error | null>} */
  const error = ref(null);

  /** @type {import('vue').Ref<Awaited<T> | null>} */
  const data = ref(null);

  /**
   * Executes the provided operation and handles loading, error, and success states.
   * @returns {Promise<OperationResult|null>}
   */
  async function execute() {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await operation();
      data.value = result;

      // Call success handler if provided
      onSuccess?.(result);

      return result;
    } catch (operationError) {
      error.value = ensureError(operationError);

      // Call error handler if provided
      onError?.(error.value);

      return null;
    } finally {
      isLoading.value = false;
    }
  }

  // Automatically execute on mount if requested
  if (executeOnMount) {
    onMounted(execute);
  }

  return { isLoading, error, data, execute };
}
