import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Req,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './types/custemRequest';
import { UserRole } from 'src/common/enums/user-role-enum';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('users')
  async findAll() {
    try {
      return await this.service.findAll();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Get('user/me')
  async findMe(@Req() req: AuthenticatedRequest) {
    try {
      const user = req.user;
      return await this.service.findById(user._id);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Get(`user/:id`)
  async findById(@Param('id') id: string) {
    try {
      return await this.service.findById(id);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Get('users/search/:search')
  async findByEmailAndName(
    @Param('search') search: string,
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const user = req.user;
      const userRole = await this.service.findById(user._id);

      if (
        userRole.role !== UserRole.SUPER_ADMIN &&
        userRole.role !== UserRole.ADMIN
      ) {
        throw new BadRequestException('You are not authorized!');
      }
      return await this.service.findByEmailAndName(search);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Delete('user/:id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    try {
      const user = req.user;
      const userRole = await this.service.findById(user._id);

      if (user._id === id) {
        throw new BadRequestException('You cannot delete yourself!');
      }

      if (userRole.role !== UserRole.SUPER_ADMIN) {
        throw new BadRequestException('You are not authorized!');
      }
      return await this.service.delete(id);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Put('user/:id')
  async update(
    @Param('id') id: string,
    @Body() dto: { name?: string; role?: UserRole },
    @Req() req: AuthenticatedRequest,
  ) {
    try {
      const currentUser = req.user;
      const userRole = await this.service.findById(currentUser._id);

      if (userRole.role !== UserRole.SUPER_ADMIN) {
        throw new BadRequestException('You are not authorized!');
      }

      // Faqat o'zining role ni o'zgartirishga ruxsat berilmaydi
      if (currentUser._id === id && dto.role !== userRole.role) {
        throw new BadRequestException('You cannot update your own role!');
      }

      return await this.service.update(id, dto);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const { token, user } = await this.service.login(dto);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000 * 4,
        })
        .json(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Post('register')
  async register(
    @Body() dto: { name: string; email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const { token, user } = await this.service.registerLocal(dto);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000 * 4,
        })
        .json(user);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Res() res: Response, @Req() req: AuthenticatedRequest) {
    try {
      const user = req.user;
      const token = await this.service.validateGoogleUser(user);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000 * 4,
        })
        .redirect(`${process.env.CLIENT_URL}/dashboard`);
    } catch (error) {
      console.error(error);

      const errorMessage = encodeURIComponent(
        'Foydalanuvchi allaqachon roʻyxatdan oʻtgan',
      );
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=${errorMessage}`,
      );
    }
  }
}
