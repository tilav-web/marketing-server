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
import { NodesService } from './nodes.service';
import { CreateNodeDto, UpdateNodeDto } from './nodes.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly service: NodesService) {}

  @Post()
  async create(@Body() createNodeDto: CreateNodeDto) {
    try {
      return await this.service.create(createNodeDto);
    } catch (error) {
      console.log(error);
      throw new HttpException('Failed to create node', HttpStatus.BAD_REQUEST);
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
  async update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    try {
      return await this.service.update(id, updateNodeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':node/:diagram')
  async remove(@Param('node') node: string, @Param('diagram') diagram: string) {
    try {
      await this.service.remove({ node, diagram });
      return { message: 'Node deleted successfully' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
