import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { CreateDiagramDto, UpdateDiagramDto } from './diagram.dto';

@Controller('diagrams')
export class DiagramController {
  constructor(private readonly diagramService: DiagramService) {}

  @Post()
  async create(@Body() createDiagramDto: CreateDiagramDto) {
    try {
      return await this.diagramService.create(createDiagramDto);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Diagram yaratishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('save')
  async save(@Body() diagramData: UpdateDiagramDto & { _id?: string }) {
    try {
      return await this.diagramService.saveDiagram(diagramData);
    } catch (error) {
      console.log(error);

      throw new HttpException(
        'Diagram saqlashda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('user/:id')
  async findAll(@Param('id') id: string) {
    try {
      return await this.diagramService.findAll(id);
    } catch (error) {
      console.log(error);
      throw new HttpException('Diagrammalar topilmadi', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.diagramService.findOne(id);
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDiagramDto: UpdateDiagramDto,
  ) {
    try {
      return await this.diagramService.update(id, updateDiagramDto);
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.diagramService.remove(id);
      return { message: 'Diagram o‘chirildi' };
    } catch (error) {
      console.log(error);

      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
