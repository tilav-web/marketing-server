import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Shape } from '../shape/shape.schema';

@Schema({ timestamps: true })
export class Diagram extends Document {
  @Prop({ required: true, default: 'New diagram' })
  name: string;

  @Prop({ required: true, ref: 'User', type: Types.ObjectId })
  userId: Types.ObjectId;

  @Prop({ type: [Shape], default: [] })
  shapes: Shape[];
}
export const DiagramSchema = SchemaFactory.createForClass(Diagram);
