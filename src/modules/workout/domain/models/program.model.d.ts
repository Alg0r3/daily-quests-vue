export type Program = {
  id: UUID;
  name: string;
  startedOn: string;
  endedOn: string | null;
  notes: string | null;
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
};
