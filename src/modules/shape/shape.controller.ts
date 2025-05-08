import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ShapeService } from './shape.service';
import { CreateShapeDto, UpdateShapeDto } from './shape.dto';
import { Shape } from './shape.schema';

@Controller('shapes')
export class ShapeController {
  constructor(private readonly shapeService: ShapeService) {}

  @Post()
  async create(@Body() createShapeDto: CreateShapeDto): Promise<Shape> {
    try {
      return await this.shapeService.create(createShapeDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create shape: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(): Promise<Shape[]> {
    try {
      return await this.shapeService.findAll();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch shapes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Shape> {
    try {
      return await this.shapeService.findOne(id);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch shape: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('diagram/:id')
  async findByDiagramId(@Param('id') id: string): Promise<Shape[]> {
    try {
      return await this.shapeService.findByDiagramId(id);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch shapes for diagram: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put('update-many')
  async updateMany(@Body() shapes: Shape[]): Promise<Shape[]> {
    try {
      return await this.shapeService.updateMany(shapes);
    } catch (error) {
      throw new HttpException(
        `Failed to update shapes: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShapeDto: UpdateShapeDto,
  ): Promise<Shape> {
    try {
      return await this.shapeService.update(id, updateShapeDto);
    } catch (error) {
      throw new HttpException(
        `Failed to update shape: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.shapeService.delete(id);
    } catch (error) {
      throw new HttpException(
        `Failed to delete shape: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
