import { Program } from '@/modules/workout/domain/models';

export type ProgramRepository = {
  findAll(): Promise<Program[]>;
  findById(id: UUID): Promise<Program | undefined>;
  save(program: Program): Promise<UUID>;
  update(id: UUID, changes: Partial<Program>): Promise<boolean>;
};
