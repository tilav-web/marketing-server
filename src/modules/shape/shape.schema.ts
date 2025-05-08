import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

interface Size {
  width: number;
  height: number;
}

interface Colors {
  background: string;
  text: string;
}

interface Position {
  x: number;
  y: number;
}

interface United {
  id: string;
  part: 'top' | 'bottom' | 'left' | 'right';
}

@Schema({ timestamps: true })
export class Shape extends Document {
  @Prop({ required: true, default: 'Some text' })
  content: string;

  @Prop({ required: true, type: Object, default: { width: 300, height: 200 } })
  size: Size;

  @Prop({ required: true, ref: 'Diagram' })
  diagram: Types.ObjectId;

  @Prop({
    required: true,
    type: Object,
    default: { background: '#ffffff', text: '#000000' },
  })
  colors: Colors;

  @Prop({ required: true, type: Object, default: { x: 0, y: 0 } })
  position: Position;

  @Prop({ type: [Object] })
  united: United[];
}

export const ShapeSchema = SchemaFactory.createForClass(Shape);
