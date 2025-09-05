import axios from 'axios';

/**
 * Fetch JSON from a URL
 * @template T
 * @param {string} url
 * @return {Promise<T>}
 */
export async function get(url) {
  const response = await axios.get(url);
  return response.data;
}
