import Dexie from 'dexie';

/** @typedef {import('@/modules/workout/domain/models/settings.model.d.ts').Settings} Settings */
/** @typedef {import('@/modules/workout/domain/models/program.model.d.ts').Program} Program */
/** @typedef {import('@/modules/workout/domain/models/workout-session.model.d.ts').WorkoutSession} WorkoutSession */
/** @typedef {import('@/modules/workout/domain/models/exercise.model.d.ts').Exercise} Exercise */
/** @typedef {import('@/modules/workout/domain/models/session-exercise.model.d.ts').SessionExercise} SessionExercise */
/** @typedef {import('@/modules/workout/domain/models/exercise-set.model.d.ts').ExerciseSet} ExerciseSet */

export const database = new Dexie('daily-quests-vue');

database.version(1).stores({
  settings: 'id',
  programs: 'id, startedOn, deletedAt',
  workoutSessions: 'id, programId, performedOn, deletedAt',
  exercises: 'id, name, archivedAt',
  sessionExercises: 'id, workoutSessionId, exerciseId, sortIndex, deletedAt',
  exerciseSets: 'id, sessionExerciseId, sortIndex, deletedAt',
});

/** @type {import('dexie').Table<Settings, UUID>} */
export const settingsTable = database.table('settings');

/** @type {import('dexie').Table<Program, UUID>} */
export const programsTable = database.table('programs');

/** @type {import('dexie').Table<WorkoutSession, UUID>} */
export const workoutSessionsTable = database.table('workoutSessions');

/** @type {import('dexie').Table<Exercise, UUID>} */
export const exercisesTable = database.table('exercises');

/** @type {import('dexie').Table<SessionExercise, UUID>} */
export const sessionExercisesTable = database.table('sessionExercises');

/** @type {import('dexie').Table<ExerciseSet, UUID>} */
export const exerciseSetsTable = database.table('exerciseSets');
