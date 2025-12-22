export interface Exercise {
  id: UUID;
  workoutId: UUID;
  movementId?: UUID;
  notes?: string;
  sets: string[]; // TODO: use ExerciseSet[]
}
