import { IsEmail, IsEnum, IsString, MinLength } from '@nestjs/class-validator';
import { UserProvider } from 'src/common/enums/user-provider-enum';
import { UserRole } from 'src/common/enums/user-role-enum';

export class UserCreateDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsEmail()
  email: string;

  password?: string;

  @IsEnum(UserProvider)
  provider: UserProvider;

  googleId?: string;
  avatar?: string;
}

export class UserResponseDto {
  name: string;
  email: string;
  provider: string;
  avatar: string;
  role: UserRole;
}
