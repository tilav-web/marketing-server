import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';
import { ContentModule } from './modules/content/content.module';
import { TaskModule } from './modules/tasks/task.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/marketing'),
    UserModule,
    ContentModule,
    TaskModule,
  ],
})
export class AppModule {}
