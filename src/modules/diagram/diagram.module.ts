// diagram.module.ts
import { Module } from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { DiagramController } from './diagram.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Diagram, DiagramSchema } from './diagram.schema';
import { ShapeModule } from '../shape/shape.module'; // TO‘G‘RI yo‘l

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Diagram.name,
        schema: DiagramSchema,
      },
    ]),
    ShapeModule, // BU YERDA!
  ],
  providers: [DiagramService],
  controllers: [DiagramController],
})
export class DiagramModule {}
