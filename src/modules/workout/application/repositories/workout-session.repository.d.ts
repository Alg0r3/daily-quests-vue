import { WorkoutSession } from '@/modules/workout/domain/models';

export type WorkoutSessionRepository = {
  findAll(): Promise<WorkoutSession[]>;
  findById(id: UUID): Promise<WorkoutSession | undefined>;
  save(workoutSession: WorkoutSession): Promise<UUID>;
  update(id: UUID, changes: Partial<WorkoutSession>): Promise<boolean>;
};
