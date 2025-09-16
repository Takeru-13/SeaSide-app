import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService,) { }
  
  
  
  // __________login_____________

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException('メールアドレスまたはパスワードが違います');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('メールまたはパスワードが違います。');
    const safeUser = { id: user.id, userName: user.userName, email: user.email };
    const payload = { sub: user.id, email: user.email, userName: user.userName };
    const token = await this.jwt.signAsync(payload);
    return { token, user: safeUser };
  }



  // _________register___________

  async register(params: { userName: string; email: string; password: string; gender?: string }) {
    const { userName, email, password, gender } = params;

    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) throw new ConflictException('このメールアドレスは既に使用されています。');

    const hash = await bcrypt.hash(password, 10);

    const created = await this.prisma.user.create({
      data: { userName, email, password: hash, gender },
      select: { id: true, userName: true, email: true }, // フロントの AuthUser に合わせる
    });

    return created; // { id, userName, email }
  }
}
