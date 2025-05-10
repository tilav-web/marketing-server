// diagram.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { DiagramService } from './diagram.service';
import { DiagramController } from './diagram.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Diagram, DiagramSchema } from './diagram.schema';
import { NodesModule } from '../nodes/nodes.module'; // TO‘G‘RI yo‘l
import { EdgesModule } from '../edges/edges.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Diagram.name,
        schema: DiagramSchema,
      },
    ]),
    NodesModule,
    EdgesModule,
    forwardRef(() => NodesModule),
  ],
  providers: [DiagramService],
  controllers: [DiagramController],
  exports: [DiagramService],
})
export class DiagramModule {}
