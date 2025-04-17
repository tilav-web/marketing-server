import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserProvider } from 'src/common/enums/user-provider-enum';
import { UserRole } from 'src/common/enums/user-role-enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  password?: string;

  @Prop({ enum: UserProvider, default: UserProvider.LOCAL })
  provider: UserProvider;

  @Prop({ default: null })
  googleId?: string;

  @Prop({ default: null })
  avatar?: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
