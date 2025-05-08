import { Module } from '@nestjs/common';
import { ShapeService } from './shape.service';
import { ShapeController } from './shape.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shape, ShapeSchema } from './shape.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Shape.name,
        schema: ShapeSchema,
      },
    ]),
  ],
  providers: [ShapeService],
  controllers: [ShapeController],
  exports: [ShapeService],
})
export class ShapeModule {}
