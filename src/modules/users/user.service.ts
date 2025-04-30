import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { UserResponseDto } from './user.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { UserProvider } from 'src/common/enums/user-provider-enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<User>,
    private jwtService: JwtService,
  ) {}

  generateJwt({
    email,
    _id,
    provider,
  }: {
    email: string;
    _id: string;
    provider: UserProvider;
  }): string {
    return this.jwtService.sign({ email, _id, provider });
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.model.find().select('-password').lean().exec();
      return plainToInstance(UserResponseDto, users);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  async findById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.model
        .findById(id)
        .select('-password')
        .lean()
        .exec();
      if (!user) throw new NotFoundException('User not found!');
      return plainToInstance(UserResponseDto, user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  async registerLocal(dto: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ token: string; user: UserResponseDto }> {
    try {
      const userExists = await this.model.findOne({ email: dto.email });
      if (userExists) throw new BadRequestException('Email already in use');

      const hashPassword = await bcrypt.hash(dto.password, 10);

      const user = new this.model({
        name: dto.name,
        password: hashPassword,
        email: dto.email,
        provider: UserProvider.LOCAL,
      });
      await user.save();

      const token = this.generateJwt({
        email: user.email,
        _id: user._id.toString(),
        provider: user.provider,
      });

      return { token, user };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  async validateGoogleUser(dto: {
    email: string;
    name: string;
    googleId: string;
    avatar: string;
  }): Promise<string> {
    try {
      let user = await this.model.findOne({
        email: dto.email,
      });

      if (!user) {
        user = new this.model({
          name: dto.name,
          email: dto.email,
          provider: UserProvider.GOOGLE,
          googleId: dto.googleId,
          avatar: dto.avatar,
        });
        await user.save();
      }

      if (user.provider !== UserProvider.GOOGLE) {
        throw new BadRequestException('Invalid provider');
      }

      return this.generateJwt({
        email: user.email,
        _id: user._id.toString(),
        provider: UserProvider.GOOGLE,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  async login(dto: {
    email: string;
    password: string;
  }): Promise<{ token: string; user: UserResponseDto }> {
    try {
      const user = await this.model
        .findOne({
          email: dto.email,
          provider: UserProvider.LOCAL,
        })
        .lean()
        .exec();

      if (!user || !user.password) {
        throw new BadRequestException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(dto.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Invalid email or password');
      }
      const token = this.generateJwt({
        email: user.email,
        _id: user._id.toString(),
        provider: user.provider,
      });
      return { token, user };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  async findByEmailAndName(search: string): Promise<UserResponseDto[]> {
    try {
      const users = await this.model
        .find({
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
          ],
        })
        .skip(0)
        .limit(10)
        .select('-password')
        .lean()
        .exec();
      return plainToInstance(UserResponseDto, users);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  async delete(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.model
        .findByIdAndDelete(id)
        .select('-password')
        .lean()
        .exec();
      if (!user) throw new NotFoundException('User not found!');
      return plainToInstance(UserResponseDto, user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }
  async update(
    id: string,
    dto: Partial<UserResponseDto>,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.model
        .findByIdAndUpdate(id, dto, {
          new: true,
        })
        .select('-password')
        .lean()
        .exec();
      if (!user) throw new NotFoundException('User not found!');
      return plainToInstance(UserResponseDto, user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }
}
