import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { CreateDiagramDto, UpdateDiagramDto } from './diagram.dto';
import { Diagram } from './diagram.schema';

@Controller('diagrams')
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @Post(':userId')
  async create(
    @Body() createDiagramDto: CreateDiagramDto,
    @Param('userId') userId: string,
  ): Promise<Diagram> {
    try {
      const diagram = await this.diagramService.create({
        ...createDiagramDto,
        userId,
      });
      return { ...diagram.toObject(), shapes: [] };
    } catch (error) {
      throw new HttpException(
        `Failed to create diagram: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: string): Promise<Diagram[]> {
    try {
      return await this.diagramService.findAll(userId);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch diagrams: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Diagram> {
    try {
      return await this.diagramService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch diagram: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiagramDto: UpdateDiagramDto,
  ): Promise<Diagram> {
    try {
      return await this.diagramService.update(id, updateDiagramDto);
    } catch (error) {
      throw new HttpException(
        `Failed to update diagram: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.diagramService.delete(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete diagram: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
