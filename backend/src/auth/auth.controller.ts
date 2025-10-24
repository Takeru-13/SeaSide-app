// backend/src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '../common/guards/auth.guard';

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
    
    // トークンとユーザー情報をJSONで返す（Cookieは使わない）
    return { token, user };
  }
  
  @Post('logout')
  @HttpCode(204)
  logout() {
    // フロントエンドでlocalStorage.clear()するだけ
    // JWTはステートレスなので何もしない
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Req() req: any) {
    // AuthGuardでreq.userにpayloadが格納される
    return {
      id: req.user.sub, // ★ payloadのsubがユーザーID
      userName: req.user.userName,
      email: req.user.email,
    };
  }
}