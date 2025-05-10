import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NodesDocument = Nodes & Document;

@Schema({ timestamps: true })
export class Nodes {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true, default: 'custom' })
  type: string;

  @Prop({ required: true, ref: 'Diagram' })
  diagram: Types.ObjectId;

  @Prop({
    type: Object,
    default: { x: 0, y: 0 },
  })
  position: {
    x: number;
    y: number;
  };

  @Prop({
    type: Object,
    default: {
      label: 'Node',
      width: 120,
      height: 60,
      backgroundColor: '#ffffff',
      color: '#000000',
      rotate: 0,
    },
  })
  data: {
    label?: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    color?: string;
    rotate?: number;
  };
}

export const NodesSchema = SchemaFactory.createForClass(Nodes);
