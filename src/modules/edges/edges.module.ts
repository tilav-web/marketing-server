import { forwardRef, Module } from '@nestjs/common';
import { EdgesController } from './edges.controller';
import { EdgesService } from './edges.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Edges, EdgesSchema } from './edges.schema';
import { DiagramModule } from '../diagram/diagram.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Edges.name,
        schema: EdgesSchema,
      },
    ]),
    forwardRef(() => DiagramModule),
  ],
  controllers: [EdgesController],
  providers: [EdgesService],
  exports: [EdgesService],
})
export class EdgesModule {}
