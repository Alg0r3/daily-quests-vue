export type SessionExercise = {
  id: UUID;
  workoutSessionId: UUID;
  exerciseId: UUID;
  sortIndex: number;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};
