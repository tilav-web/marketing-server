import { Types } from 'mongoose';
import { TaskStatusEnum } from 'src/common/enums/task-status-enum';

export class TaskCreateDto {
  task: string;
  status: TaskStatusEnum;
  author: Types.ObjectId;
}

export class TaskUpdateDto {
  task?: string;
  status?: TaskStatusEnum;
  message?: string;
  done: Date;
}

export class TaskResponseDto {
  _id: string;
  task: string;
  status: TaskStatusEnum;
  message?: string;
  author?: Types.ObjectId;
  done: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
