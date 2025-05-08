export class CreateDiagramDto {
  name: string;
  shapes?: string[];
  userId?: string;
}

export class UpdateDiagramDto {
  name?: string;
  shapes?: string[];
}
