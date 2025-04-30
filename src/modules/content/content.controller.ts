import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto, UpdateContentDto } from './content.dto';
import { Content } from './content.schema';

@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Post()
  async create(@Body() createContentDto: CreateContentDto): Promise<Content> {
    return this.service.create(createContentDto);
  }

  @Get()
  async findAll(): Promise<Content[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Content> {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    return this.service.update(id, updateContentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }
}
