import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertRecordDto } from './dto/upsert-record.dto';

@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) {}

  private startEndofMonth(ym: string) {
    const [y, m] = ym.split('-').map(Number);
    if (!y || !m) throw new BadRequestException('invalid ym');
    const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
    const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
    return { start, end };
  }

  async getPartnerId(meId: number) {
    const pair = await this.prisma.pair.findFirst({
      where: { OR: [{ userAId: meId }, { userBId: meId }] },
      select: { userAId: true, userBId: true },
    });
    if (!pair) return null;
    return pair.userAId === meId ? pair.userBId : pair.userAId;
  }

  async findMonthly(ym: string, scope: 'me' | 'pair', meId: number) {
    if (!meId) throw new UnauthorizedException();
    const { start, end } = this.startEndofMonth(ym);

    let targetUserId = meId;
    if (scope === 'pair') {
      const partnerId = await this.getPartnerId(meId);
      if (!partnerId) return [];
      targetUserId = partnerId;
    }

    const rows = await this.prisma.record.findMany({
      where: { userId: targetUserId, date: { gte: start, lt: end } },
      orderBy: { date: 'asc' },
      select: { date: true, emotion: true },
    });

    return rows.map(r => ({
      date: r.date.toISOString().slice(0, 10),
      score: r.emotion ?? undefined,
    }));
  }

  async upsertByDate(dateStr: string, dto: UpsertRecordDto, meId: number) {
    if (!meId) throw new UnauthorizedException();

    // "YYYY-MM-DD" を UTC の0時に正規化
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) throw new BadRequestException('invalid date format');
    const date = new Date(`${dateStr}T00:00:00.000Z`);

    // 未来日ブロック（UIも禁止だが直叩き対策）
    const todayUTC = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00.000Z');
    if (date > todayUTC) throw new BadRequestException('future date is not allowed');

    const rec = await this.prisma.record.upsert({
      where: { userId_date: { userId: meId, date } }, // @@unique([userId, date])
      update: { meal: dto.meal, sleep: dto.sleep, medicine: dto.medicine, period: dto.period, emotion: dto.emotion },
      create: { userId: meId, date, meal: dto.meal, sleep: dto.sleep, medicine: dto.medicine, period: dto.period, emotion: dto.emotion },
      select: { date: true, meal: true, sleep: true, medicine: true, period: true, emotion: true },
    });

    return {
      date: rec.date.toISOString().slice(0, 10),
      meal: rec.meal as any,
      sleep: rec.sleep as any,
      medicine: rec.medicine as any,
      period: rec.period as any,
      emotion: rec.emotion as number,
    };


    
  }
// 既存の RecordsService に追記
async findOneByDate(dateStr: string, meId: number) {
  if (!meId) throw new UnauthorizedException();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) throw new BadRequestException('invalid date format');
  const date = new Date(`${dateStr}T00:00:00.000Z`);

  const rec = await this.prisma.record.findUnique({
    where: { userId_date: { userId: meId, date } }, // @@unique([userId, date])
    select: { date: true, meal: true, sleep: true, medicine: true, period: true, emotion: true },
  });

  if (!rec) return null;

  return {
    date: rec.date.toISOString().slice(0, 10),
    meal: rec.meal as any,
    sleep: rec.sleep as any,
    medicine: rec.medicine as any,
    period: rec.period as any,
    emotion: rec.emotion as number,
  };
}

}
