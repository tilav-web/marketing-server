import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatusEnum } from 'src/common/enums/task-status-enum';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  task: string;

  @Prop({ default: null })
  message: string;

  @Prop({ enum: TaskStatusEnum, default: TaskStatusEnum.TASK })
  status: TaskStatusEnum;

  @Prop({ ref: 'User', type: Types.ObjectId })
  author: Types.ObjectId;

  @Prop({ default: null })
  done: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
