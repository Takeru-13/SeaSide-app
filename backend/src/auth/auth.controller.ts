// auth.controller.ts
import { Body, Controller, Post, Res, HttpCode, Get, Req, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { COOKIE_NAME, SLIDING_MAX_AGE_MS } from './auth.const';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.service.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, user } = await this.service.login(dto.email, dto.password);

    // ←← ここから追加：環境でCookieのオプションを切替
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: SLIDING_MAX_AGE_MS,       // 48h
      secure: isProd,                   // 本番: true / ローカル: false
      sameSite: isProd ? 'none' : 'lax',
      partitioned: true as any,
    });

    return user; // 安全なユーザー情報のみ返す
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    res.clearCookie(COOKIE_NAME, {
      path: '/',
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    return {
      id: req.user.id,
      userName: req.user.userName,
      email: req.user.email,
      iconUrl: req.user.iconUrl,
    };
  }
}
