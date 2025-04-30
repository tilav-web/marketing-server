import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ContentStatusEnum } from 'src/common/enums/content-status-enum';

export class CreateContentDto {
  @IsString()
  name: string;

  @IsEnum(ContentStatusEnum)
  @IsOptional()
  status?: ContentStatusEnum;

  @IsString()
  type: string;

  @IsString()
  publish_date: string;

  @IsString()
  assignedTo: string;
}

export class UpdateContentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(ContentStatusEnum)
  @IsOptional()
  status?: ContentStatusEnum;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  publish_date?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;
}
