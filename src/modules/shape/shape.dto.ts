export class CreateShapeDto {
  content: string;
  size: { width: number; height: number };
  colors: { background: string; text: string };
  position: { x: number; y: number };
  diagram: string;
  united?: Array<{ id: string; part: 'top' | 'bottom' | 'left' | 'right' }>;
}

export class UpdateShapeDto {
  content?: string;
  size?: { width: number; height: number };
  colors?: { background: string; text: string };
  position?: { x: number; y: number };
  united?: Array<{ id: string; part: 'top' | 'bottom' | 'left' | 'right' }>;
}
