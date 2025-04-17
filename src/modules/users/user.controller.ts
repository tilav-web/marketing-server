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
} from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedRequest } from './types/custemRequest';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('users')
  async findAll() {
    try {
      return await this.findAll();
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Server error!');
    }
  }

  @Get(`user/:id}`)
  async findById(@Param('id') id: string) {
    try {
      return await this.service.findById(id);
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

  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
    @Res() res: Response,
  ) {
    try {
      const token = await this.service.login(dto);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000 * 4,
        })
        .json('Login successfull');
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
      const token = await this.service.registerLocal(dto);
      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          maxAge: 3600000 * 4,
        })
        .json('Register successfull');
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
        .redirect(`${process.env.CLIENT_URL}`);
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
