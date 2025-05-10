import { IsString, IsOptional, IsObject } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNodeDto {
  @IsString()
  id: string;

  diagram: Types.ObjectId;

  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  position: {
    x: number;
    y: number;
  };

  @IsObject()
  data: {
    label?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    color?: string;
  };
}

export class UpdateNodeDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsObject()
  @IsOptional()
  position?: {
    x: number;
    y: number;
  };

  @IsObject()
  @IsOptional()
  data?: {
    label?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    color?: string;
  };
}
