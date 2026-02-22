export type ExerciseSet = {
  id: UUID;
  sessionExerciseId: UUID;
  sortIndex: number;
  reps: number;
  weightKg: number | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};
