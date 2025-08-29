import workoutData from '@/features/workouts/fixtures/workouts.json'
import { v7 as uuidv7 } from 'uuid'

/** @typedef {import('@/features/workouts/models/workout.js').Workout} Workout*/

/** @type {Workout[]} */
let data = [...workoutData]

/** @returns {Promise<Workout[]>} */
export async function getWorkouts() {
  return data
}

/**
 * @param {Omit<Workout, id>} payload
 * @returns {Promise<Workout>}
 */
export async function createWorkout(payload) {
  const id = uuidv7()
  const workout = {
    id: id,
    name: payload.name,
  }

  data.push(workout)

  return workout
}
