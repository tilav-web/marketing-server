import { forwardRef, Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesController } from './nodes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Nodes, NodesSchema } from './nodes.schema';
import { DiagramModule } from '../diagram/diagram.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Nodes.name,
        schema: NodesSchema,
      },
    ]),
    forwardRef(() => DiagramModule),
  ],
  providers: [NodesService],
  controllers: [NodesController],
  exports: [NodesService],
})
export class NodesModule {}
