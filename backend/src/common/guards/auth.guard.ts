// backend/src/common/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('認証トークンがありません');
    }

    const token = authHeader.substring(7); // "Bearer " を除去
    
    try {
      // process.envを直接使用（ConfigService不要）
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      
      // requestオブジェクトにユーザー情報を追加
      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('無効または期限切れのトークンです');
    }
  }
}