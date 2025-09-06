/**
 * Ensure any throw value is returned as an Error instance.
 *
 * @param {unknown} error
 * @returns {Error}
 */
export function ensureError(error) {
  return error instanceof Error ? error : new Error(String(error));
}
