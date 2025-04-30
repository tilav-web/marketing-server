import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from './task.dto';
import { AuthenticatedRequest } from '../users/types/custemRequest';

@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  async findAll(@Req() req: AuthenticatedRequest): Promise<TaskResponseDto[]> {
    const user = req.user;
    return await this.service.findAll(user._id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: TaskUpdateDto,
  ): Promise<TaskResponseDto> {
    return await this.service.update(id, dto);
  }

  @Post()
  async create(
    @Body() dto: TaskCreateDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    const user = req.user;
    return await this.service.create({ author: user._id, ...dto });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.service.delete(id);
  }
}
