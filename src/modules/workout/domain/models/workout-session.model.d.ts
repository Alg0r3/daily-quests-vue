export type WorkoutSession = {
  id: UUID;
  programId: UUID | null;
  performedOn: string;
  label: string | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};
