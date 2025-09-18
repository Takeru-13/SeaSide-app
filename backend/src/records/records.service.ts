import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertRecordDto } from './dto/upsert-record.dto';
@Injectable()
export class RecordsService {
  constructor(private prisma: PrismaService) { }
  
  private startEndofMonth(ym: string) {

    const [y, m] = ym.split('-').map(Number);
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
    });

    return rows.map(r => ({
      date: r.date.toISOString().slice(0, 10),
      score: r.emotion,
    }));
  }


  async upsertByDate(dateStr: string, dto: UpsertRecordDto, meId: number) {
    // 未来日禁止（UTC基準で日だけ比較）
    const date = new Date(`${dateStr}T00:00:00.000Z`);
    const todayUTC = new Date();
    const todayDate = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), todayUTC.getUTCDate()));
    if (date > todayDate) {
      throw new BadRequestException('未来の日付には記録できません');
    }


    const meal = JSON.parse(dto.meal);
    const sleep = JSON.parse(dto.sleep);
    const medicine = JSON.parse(dto.medicine);

    const rec = await this.prisma.record.upsert({
      where: { userId_date: { userId: meId, date } },
      update: { meal, sleep, medicine, period: dto.period, emotion: dto.emotion },
      create: { userId: meId, date, meal, sleep, medicine, period: dto.period, emotion: dto.emotion },
    });

    return {
      date: rec.date.toISOString().slice(0, 10),
      score: rec.emotion,
    };
  }

}