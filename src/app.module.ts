import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { ContentModule } from './modules/content/content.module';
import { TaskModule } from './modules/tasks/task.module';
import { DiagramModule } from './modules/diagram/diagram.module';
import { NodesModule } from './modules/nodes/nodes.module';
import { EdgesModule } from './modules/edges/edges.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/marketing'),
    UserModule,
    ContentModule,
    TaskModule,
    DiagramModule,
    NodesModule,
    EdgesModule,
  ],
})
export class AppModule {}
