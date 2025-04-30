import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './task.schema';
import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from './task.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  async create(dto: TaskCreateDto): Promise<TaskResponseDto> {
    const newTask = new this.model({
      task: dto.task,
      author: new Types.ObjectId(dto.author),
      status: dto.status,
    });
    await newTask.save();
    const resTask = await this.model.findById(newTask._id).lean().exec();
    return plainToInstance(TaskResponseDto, resTask);
  }

  async findAll(author: string): Promise<TaskResponseDto[]> {
    const tasks = await this.model
      .find({ author: new Types.ObjectId(author) })
      .lean()
      .exec();
    return plainToInstance(TaskResponseDto, tasks);
  }

  async delete(id: string): Promise<TaskResponseDto> {
    const task = await this.model.findByIdAndDelete(id).exec();
    if (!task) {
      throw new Error('Task not found');
    }
    return plainToInstance(TaskResponseDto, task);
  }

  async update(
    id: string,
    dto: Partial<TaskUpdateDto>,
  ): Promise<TaskResponseDto> {
    const task = await this.model
      .findByIdAndUpdate(id, dto, {
        new: true,
      })
      .exec();
    if (!task) {
      throw new Error('Task not found');
    }
    return plainToInstance(TaskResponseDto, task);
  }
}
