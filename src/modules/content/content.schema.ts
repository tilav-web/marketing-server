import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContentStatusEnum } from 'src/common/enums/content-status-enum';
import { User } from '../users/user.schema';

@Schema({ timestamps: true })
export class Content extends Document {
  @Prop()
  name: string;

  @Prop({ enum: ContentStatusEnum, default: ContentStatusEnum.PUBLISHED })
  status: ContentStatusEnum;

  @Prop()
  type: string;

  @Prop()
  publish_date: string;

  @Prop({ ref: User.name })
  assignedTo: Types.ObjectId;
}

export const ContentSchema = SchemaFactory.createForClass(Content);
