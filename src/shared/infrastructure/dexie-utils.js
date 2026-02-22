/**
 * Convert a Dexie PromiseLike to a native Promise.
 *
 * @template T
 * @param {PromiseLike<T>} promiseLike
 * @returns {Promise<T>}
 */
export function toNativePromise(promiseLike) {
  return Promise.resolve(promiseLike);
}
