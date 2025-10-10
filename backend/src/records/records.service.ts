import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type Scope = 'me' | 'pair';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 自分の相手（ペア）の userId を返す。なければ null */
  private async getPartnerId(viewerId: number): Promise<number | null> {
    const pair = await this.prisma.pair.findFirst({
      where: { OR: [{ userAId: viewerId }, { userBId: viewerId }] },
      select: { userAId: true, userBId: true },
    });
    if (!pair) return null;
    return pair.userAId === viewerId ? pair.userBId : pair.userAId;
  }

  /** 'YYYY-MM-DD' → Date(UTC 00:00) */
  private dateKey(dateStr: string): Date {
    return new Date(`${dateStr}T00:00:00.000Z`);
  }

  /** 'YYYY-MM' の範囲（UTC 00:00） */
  private monthRange(ym: string): { start: Date; end: Date } {
    const y = Number(ym.slice(0, 4));
    const m = Number(ym.slice(5, 7));
    return {
      start: new Date(Date.UTC(y, m - 1, 1, 0, 0, 0, 0)),
      end:   new Date(Date.UTC(y, m,     1, 0, 0, 0, 0)),
    };
  }

  private clampEmotion(n: unknown): number {
    const x = typeof n === 'number' ? n : Number(n);
    if (!Number.isFinite(x)) return 5;
    return Math.min(10, Math.max(1, Math.round(x)));
  }

  /** DB → View へ（運動・メモを含む） */
  private toView(
    rec: {
      date: Date;
      meal: any; sleep: any; medicine: any;
      period: string | null; emotion: number | null;
      exercise?: any; memo?: any;
      tookDailyMed?: boolean;
    },
    dateStr: string,
  ) {
    const meal = rec?.meal ?? {};
    const sleep = rec?.sleep ?? {};
    const medicine = rec?.medicine ?? {};
    const exercise = rec?.exercise ?? {};
    const memo = rec?.memo ?? {};

    return {
      date: dateStr,
      meal: {
        breakfast: !!meal.breakfast,
        lunch: !!meal.lunch,
        dinner: !!meal.dinner,
      },
      sleep: { time: typeof sleep.time === 'string' ? sleep.time : '' },
      medicine: {
        items: Array.isArray(medicine.items)
          ? (medicine.items as unknown[]).filter((x) => typeof x === 'string') as string[]
          : [],
      },
      period: (rec?.period ?? 'none') as 'none' | 'start' | 'during',
      emotion: this.clampEmotion(rec?.emotion),
      exercise: {
        items: Array.isArray(exercise.items)
          ? (exercise.items as unknown[]).filter((x) => typeof x === 'string') as string[]
          : [],
      },
      memo: {
        content: typeof memo.content === 'string' ? memo.content : '',
      },
      tookDailyMed: !!rec?.tookDailyMed,
    };
  }

  /** 詳細1件（targetUserId 指定: 自分 or ペア） */
  async getByDateForUser(date: string, viewerId: number, targetUserId?: number) {
    let ownerId = viewerId;
    if (targetUserId && targetUserId !== viewerId) {
      const partnerId = await this.getPartnerId(viewerId);
      if (!partnerId || partnerId !== targetUserId) {
        throw new ForbiddenException('Not allowed to view others');
      }
      ownerId = targetUserId;
    }

    const dk = this.dateKey(date);
    const rec = await this.prisma.record.findUnique({
      where: { userId_date: { userId: ownerId, date: dk } },
      select: {
        date: true, meal: true, sleep: true, medicine: true,
        period: true, emotion: true, exercise: true, memo: true,
        tookDailyMed: true, 
      },
    });

    if (!rec) return null; // Controller で 404 化
    return this.toView(rec, date);
  }

  /** 月次（カレンダー用 emotion のみ） */
  async getMonthly(ym: string, viewerId: number, scope: Scope) {
    const ownerId = scope === 'pair' ? (await this.getPartnerId(viewerId)) : viewerId;
    if (!ownerId) return { ym, days: [] as Array<{ date: string; emotion: number | null }> };

    const { start, end } = this.monthRange(ym);
    const rows = await this.prisma.record.findMany({
      where: { userId: ownerId, date: { gte: start, lt: end } },
      select: { date: true, emotion: true , tookDailyMed: true },
      orderBy: { date: 'asc' },
    });

    return {
      ym,
      days: rows.map((r) => ({
        date: r.date.toISOString().slice(0, 10),
        emotion: r.emotion ?? null,
        tookDailyMed: !!(r as any).tookDailyMed,
      })),
    };
  }

  /** 保存（常に viewer のみ／他人保存は 403） */
  async upsert(date: string, viewerId: number, input: any) {
  const dk = this.dateKey(date);

  const data = {
    userId: viewerId,
    date: dk,
    meal: {
      breakfast: !!input?.meal?.breakfast,
      lunch: !!input?.meal?.lunch,
      dinner: !!input?.meal?.dinner,
    },
    sleep: { time: typeof input?.sleep?.time === 'string' ? input.sleep.time : '' },
    medicine: {
      items: Array.isArray(input?.medicine?.items) ? input.medicine.items : [],
    },
    period: (input?.period ?? 'none') as 'none' | 'start' | 'during',
    emotion: this.clampEmotion(input?.emotion),
    exercise: {
      items: Array.isArray(input?.exercise?.items) ? input.exercise.items : [],
    },
    memo: {
      content: typeof input?.memo?.content === 'string' ? input.memo.content : '',
    },
    tookDailyMed: input?.tookDailyMed === true || input?.tookDailyMed === 'true', // ★ 追加
  };

  return this.prisma.record.upsert({
    where: { userId_date: { userId: viewerId, date: dk } },
    update: {
      meal: data.meal, sleep: data.sleep, medicine: data.medicine,
      period: data.period, emotion: data.emotion,
      exercise: data.exercise, memo: data.memo,
      tookDailyMed: data.tookDailyMed, 
    },
    create: data,
    select: {
      date: true, meal: true, sleep: true, medicine: true,
      period: true, emotion: true, exercise: true, memo: true,
      tookDailyMed: true, 
    },
  }).then((saved) => this.toView(saved, date));
}

}
