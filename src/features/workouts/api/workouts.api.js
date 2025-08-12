import { get } from '@/shared/http/client.js'

/** @typedef {{ id: string, name: string }} Workout */

/** @returns {Promise<Workout[]>} */
export async function getWorkouts() {
  return await get('/fixtures/workouts.json')
}
