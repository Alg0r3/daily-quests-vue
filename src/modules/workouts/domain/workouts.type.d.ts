export interface Workout {
  id: UUID;
  name: string;
  exercises?: string[]; // TODO: use Exercise[]
}
