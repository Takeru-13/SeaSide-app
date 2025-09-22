// backend/src/common/guards/auth.guard.ts
import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: any }>();

    // 1) Cookie 優先 / 2) Authorization: Bearer fallback
    const bearer = req.headers['authorization']?.toString();
    const headerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : undefined;
    const cookieToken = (req as any).cookies?.access_token;
    const token = cookieToken || headerToken;

    if (!token) throw new UnauthorizedException('No token');

    try {
      // 発行時と同じ secret を使うこと！
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET, // ← ここ要一致
      });
      // 必要十分な最小情報だけ載せる
      req.user = { id: payload.sub, email: payload.email, userName: payload.userName };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
