export type Exercise = {
  id: UUID;
  name: string;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  archivedAt: number | null;
};
