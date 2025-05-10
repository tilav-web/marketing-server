import { IsString, IsArray, IsOptional } from 'class-validator';
import { CreateNodeDto } from '../nodes/nodes.dto';
import { CreateEdgeDto } from '../edges/edges.dto';
import { Types } from 'mongoose';

export class CreateDiagramDto {
  @IsString()
  @IsOptional()
  title?: string;

  user: Types.ObjectId;

  @IsArray()
  @IsOptional()
  nodes?: CreateNodeDto[];

  @IsArray()
  @IsOptional()
  edges?: CreateEdgeDto[];
}

export class UpdateDiagramDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsArray()
  @IsOptional()
  nodes?: CreateNodeDto[];

  @IsArray()
  @IsOptional()
  edges?: CreateEdgeDto[];
}
