import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { user?: any }>();

    // Authorization: Bearer <token> から取得
    const bearer = req.headers['authorization']?.toString();
    const token = bearer?.startsWith('Bearer ') ? bearer.slice(7) : undefined;

    if (!token) throw new UnauthorizedException('No token');

    try {
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as { sub: number; email: string; userName: string };

      // コントローラで使う最小ユーザ情報
      req.user = { id: payload.sub, email: payload.email, userName: payload.userName };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
