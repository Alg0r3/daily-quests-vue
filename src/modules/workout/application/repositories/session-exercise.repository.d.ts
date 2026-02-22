import { SessionExercise } from '@/modules/workout/domain/models';

export type SessionExerciseRepository = {
  findByWorkoutSessionId(workoutSessionId: UUID): Promise<SessionExercise[]>;
  save(sessionExercise: SessionExercise): Promise<UUID>;
  update(id: UUID, changes: Partial<SessionExercise>): Promise<boolean>;
};
