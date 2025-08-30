import { database } from '@/features/workouts/tables/workouts.js'
import workoutData from '@/features/workouts/fixtures/workouts.json'
import { v7 as uuidv7 } from 'uuid'

/** @typedef {import('@/features/workouts/models/Workout.js').Workout} Workout*/

async function ensureSeed() {
  const count = await database.workouts.count();

  if (count === 0) {
    await database.workouts.bulkAdd(workoutData)
  }
}

/** @returns {Promise<Workout[]>} */
export async function getWorkouts() {
  await ensureSeed()

  return database.workouts.toArray()
}

/**
 * @param {Omit<Workout, id>} payload
 * @returns {Promise<Workout>}
 */
export async function createWorkout(payload) {
  const workout = {
    id: uuidv7(),
    name: payload.name,
  }

  await database.workouts.add(workout)

  return workout
}

export async function deleteWorkout(id) {
  await database.workouts.delete(id)
}
