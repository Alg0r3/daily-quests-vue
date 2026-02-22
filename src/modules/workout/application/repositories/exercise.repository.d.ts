import type { Exercise } from '@/modules/workout/domain/models';

export type ExerciseRepository = {
  findAll(): Promise<Exercise[]>;
  findById(id: UUID): Promise<Exercise | undefined>;
  save(exercise: Exercise): Promise<UUID>;
  update(id: UUID, changes: Partial<Exercise>): Promise<boolean>;
};
