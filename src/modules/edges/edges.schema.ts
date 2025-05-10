import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EdgesDocument = Edges & Document;

@Schema({ timestamps: true })
export class Edges {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  target: string;

  @Prop({ type: Types.ObjectId, ref: 'Diagram', required: true })
  diagram: Types.ObjectId;
  @Prop({ default: 'default' })
  type: string;

  @Prop({
    type: Object,
    default: {
      label: '',
      animated: false,
      style: {
        stroke: '#222',
      },
    },
  })
  data: {
    label?: string;
    animated?: boolean;
    style?: {
      stroke?: string;
      strokeWidth?: number;
    };
  };
}

export const EdgesSchema = SchemaFactory.createForClass(Edges);
