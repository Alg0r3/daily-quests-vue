import { onMounted, ref } from 'vue';
import { ensureError } from '@/shared/utils/errors.js';

/**
 * @template T
 * @template {unknown[]} TArgs
 * @typedef {object} UseAsyncOperationOptions
 * @property {(...args: TArgs) => Promise<T>} operation - The asynchronous operation to execute.
 * @property {(result: T) => void} [onSuccess] - Callback function to be called on successful execution.
 * @property {(error: Error) => void} [onError] - Callback function to be called on error.
 * @property {boolean} [suppressErrors=false] - Whether to suppress errors from being rethrown.
 * @property {boolean} [executeOnMount=false] - Whether to execute the operation on component mount.
 */

/**
 * @template T
 * @template {unknown[]} TArgs
 * @typedef {object} UseAsyncOperationReturn
 * @property {import('vue').Ref<boolean>} isLoading - Indicates whether the operation is loading.
 * @property {import('vue').Ref<Error | null>} error - Holds any error that occurred during the operation.
 * @property {import('vue').Ref<T | null>} data - Holds the result of the operation.
 * @property {(...args: TArgs) => Promise<T|null>} execute - Executes the operation.
 */

/**
 * Manages asynchronous operations with loading state, error handling, and data management.
 * @template T
 * @template {unknown[]} TArgs
 * @param {UseAsyncOperationOptions<T, TArgs>} options - Configuration options for the async operation
 * @returns {UseAsyncOperationReturn<T, TArgs>} - Object containing reactive state and execute function
 */
export function useAsyncOperation(options) {
  const {
    operation,
    onSuccess,
    onError,
    suppressErrors = false,
    executeOnMount = false,
  } = /** @type {UseAsyncOperationOptions<any, any[]>} */ (options);

  const isLoading = ref(false);
  const error = ref(/** @type {Error | null} */ (null));
  const data = ref(/** @type {any} */ (null));

  /**
   * Execute the async operation
   * @param {...any} args - Arguments to pass to the operation
   * @returns {Promise<any>} - Result of the operation or null on error
   */
  const execute = async function (...args) {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await operation(...args);
      data.value = result;

      // Call success handler if provided
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (operationError) {
      const processedError = ensureError(operationError);
      error.value = processedError;

      // Call error handler if provided
      if (onError) {
        onError(processedError);
      }

      if (!suppressErrors) {
        throw processedError;
      }

      return null;
    } finally {
      isLoading.value = false;
    }
  };

  if (executeOnMount) {
    onMounted(() => {
      // Execute without arguments for mount-time execution
      execute().catch(() => {
        // Error handling is delegated to the onError callback
        // This empty catch prevents unhandled promise rejection warnings
      });
    });
  }

  return {
    isLoading,
    error,
    data,
    execute,
  };
}
