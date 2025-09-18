// src/common/guards/auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

type JwtPayload = { id: number; email: string; iat: number; exp: number };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();

    // 1) Cookie: access_token
    const cookieToken = req.cookies?.['access_token'];

    // 2) Authorization: Bearer ...
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;

    const token = cookieToken ?? headerToken;
    if (!token) throw new UnauthorizedException('No token');

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      (req as any).user = { id: payload.id, email: payload.email }; // コントローラから参照
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
