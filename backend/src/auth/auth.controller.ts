// backend/src/auth/auth.controller.ts
import { Body, Controller, Post, Res, HttpCode, Get, Req, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';          // ← 型だけ import（isolatedModules対策）
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
    return this.service.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const { token, user } = await this.service.login(dto.email, dto.password);

    // トークンとユーザー情報を返す
    return {
      token,
      user,
    };
  }

  @Post('logout')
  @HttpCode(204)
  logout() {
    // フロントエンド側でlocalStorageをクリアするだけでOK
    // サーバー側では何もしない（JWTはステートレス）
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

  // --- 一時デバッグ用（確認後に削除してOK） ---
@Get('_debug')
debug(@Req() req: Request) {
  const cookies = (req as any).cookies ?? {};
  return {
    origin: req.headers.origin ?? null,
    hasCookie: Boolean(cookies[COOKIE_NAME]),
    cookieName: COOKIE_NAME,
    cookieKeys: Object.keys(cookies),
  };
}
}
