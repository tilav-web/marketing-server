import { IsString, IsOptional, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEdgeDto {
  @IsString()
  id: string;

  @IsString()
  source: string;

  @IsString()
  target: string;

  diagram: Types.ObjectId;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  data: {
    label?: string;
    animated?: boolean;
    style?: {
      stroke?: string;
      strokeWidth?: number;
    };
  };
}

export class UpdateEdgeDto {
  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  data?: {
    label?: string;
    animated?: boolean;
    style?: {
      stroke?: string;
      strokeWidth?: number;
    };
  };
}
