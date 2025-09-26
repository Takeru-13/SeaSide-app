import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

function genCode(len = 6) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
  let out = '';
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

@Injectable()
export class PairsService {
  constructor(private prisma: PrismaService) {}

  private async ensureNotPaired(userId: number) {
    const existing = await this.prisma.pair.findFirst({
      where: { OR: [{ userAId: userId }, { userBId: userId }] },
      select: { id: true },
    });
    if (existing) throw new BadRequestException('already paired');
  }

  async createInvite(creatorId: number) {
    if (!creatorId) throw new BadRequestException('unauthorized');
    await this.ensureNotPaired(creatorId);

    // 既存の未使用・未期限切れの招待があれば無効化（任意）
    await this.prisma.pairInvite.updateMany({
      where: {
        creatorId,
        consumedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: { expiresAt: new Date() }, // 直ちに期限切れへ
    });

    // 一意なコードを頑張って作る（衝突したらリトライ）
    let code = '';
    for (let i = 0; i < 5; i++) {
      code = genCode(6);
      const dup = await this.prisma.pairInvite.findUnique({ where: { code } });
      if (!dup) break;
      if (i === 4) throw new BadRequestException('failed to generate code');
    }

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await this.prisma.pairInvite.create({
      data: { code, creatorId, expiresAt },
    });

    return { code, expiresAt };
  }

  async connectWithCode(meId: number, code: string) {
    if (!meId) throw new BadRequestException('unauthorized');

    // 招待コードの検証
    const invite = await this.prisma.pairInvite.findUnique({
      where: { code },
      select: { code: true, creatorId: true, expiresAt: true, consumedAt: true },
    });
    if (!invite) throw new BadRequestException('invalid code');
    if (invite.consumedAt) throw new BadRequestException('code already used');
    if (invite.expiresAt <= new Date()) throw new BadRequestException('code expired');

    if (invite.creatorId === meId) {
      throw new BadRequestException('cannot connect to yourself');
    }

    // 両者とも未ペアであること
    await this.ensureNotPaired(invite.creatorId);
    await this.ensureNotPaired(meId);

    // トランザクション：ペア作成 + 招待消費
    const [pair] = await this.prisma.$transaction([
      this.prisma.pair.create({
        data: { userAId: invite.creatorId, userBId: meId },
      }),
      this.prisma.pairInvite.update({
        where: { code },
        data: { consumedAt: new Date() },
      }),
    ]);

    // 返却（必要なら partner の displayName を含める）
    const partner = { id: invite.creatorId };
    return { connected: true, partner };
  }

  async getStatus(meId: number) {
    if (!meId) throw new BadRequestException('unauthorized');
    const pair = await this.prisma.pair.findFirst({
      where: { OR: [{ userAId: meId }, { userBId: meId }] },
      select: { userAId: true, userBId: true },
    });
    if (!pair) return { connected: false };

    const partnerId = pair.userAId === meId ? pair.userBId : pair.userAId;
    // 必要ならユーザー名も取得
    // const u = await this.prisma.user.findUnique({ where: { id: partnerId }, select: { displayName: true } });
    return { connected: true, partner: { id: partnerId } };
  }
}
