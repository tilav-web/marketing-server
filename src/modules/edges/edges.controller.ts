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
import { EdgesService } from './edges.service';
import { CreateEdgeDto, UpdateEdgeDto } from './edges.dto';

@Controller('edges')
export class EdgesController {
  constructor(private readonly service: EdgesService) {}

  @Post()
  async create(@Body() createEdgeDto: CreateEdgeDto) {
    try {
      return await this.service.create(createEdgeDto);
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to create edge', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.service.findOne(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEdgeDto: UpdateEdgeDto) {
    try {
      return await this.service.update(id, updateEdgeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':edge/:diagram')
  async remove(@Param('edge') edge: string, @Param('diagram') diagram: string) {
    try {
      await this.service.remove({ edge, diagram });
      return { message: 'Node deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
