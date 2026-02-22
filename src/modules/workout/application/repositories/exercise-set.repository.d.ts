import { ExerciseSet } from '@/modules/workout/domain/models';

export type ExerciseSetRepository = {
  findBySessionExerciseId(sessionExerciseId: UUID): Promise<ExerciseSet[]>;
  save(exerciseSet: ExerciseSet): Promise<UUID>;
  update(id: UUID, changes: Partial<ExerciseSet>): Promise<boolean>;
};
