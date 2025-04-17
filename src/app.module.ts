import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/marketing'),
    UserModule,
  ],
})
export class AppModule {}
