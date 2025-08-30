import Dexie from 'dexie';

export const database = new Dexie('WorkoutLogger');

database.version(1).stores({
  workouts: 'id'
});
