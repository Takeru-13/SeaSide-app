import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(params: { userName: string; email: string; password: string; gender?: string }) {
    const { userName, email, password, gender } = params;

    // email 重複チェック
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
