import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import {
  COOKIE_NAME,
  REFRESH_THRESHOLD_SEC,
  SLIDING_MAX_AGE_MS,
} from '../../auth/auth.const';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { user?: any }>();
    const res = http.getResponse<Response>();

    // 1) Cookie 優先 / 2) Authorization: Bearer fallback
    const bearer = req.headers['authorization']?.toString();
    const headerToken = bearer?.startsWith('Bearer ') ? bearer.slice(7) : undefined;
    const cookieToken = (req as any).cookies?.[COOKIE_NAME];
    const token = cookieToken || headerToken;

    if (!token) throw new UnauthorizedException('No token');

    try {
      // payload に iat/exp を含む（sign 時の secret と一致させる）
      const payload = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET,
      }) as { sub: number; email: string; userName: string; iat?: number; exp?: number };

      // コントローラで使う最小ユーザ情報
      req.user = { id: payload.sub, email: payload.email, userName: payload.userName };

      // ---- スライディング延長：残りが閾値未満なら再発行して Set-Cookie ----
      const now = Math.floor(Date.now() / 1000);
      const remaining = (payload.exp ?? now) - now;

      if (remaining <= REFRESH_THRESHOLD_SEC) {
        const fresh = await this.jwt.signAsync(
          { sub: payload.sub, email: payload.email, userName: payload.userName },
          { expiresIn: '48h', secret: process.env.JWT_SECRET },
        );

        res.cookie(COOKIE_NAME, fresh, {
          httpOnly: true,
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: SLIDING_MAX_AGE_MS, // 48h
        });
      }
      // -------------------------------------------------------------------

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
