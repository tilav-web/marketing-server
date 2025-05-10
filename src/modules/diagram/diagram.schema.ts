import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Diagram extends Document {
  @Prop({ required: true, default: 'New diagram' })
  title: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Nodes' }] })
  nodes: Types.Array<Types.ObjectId>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Edges' }] })
  edges: Types.Array<Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const DiagramSchema = SchemaFactory.createForClass(Diagram);
