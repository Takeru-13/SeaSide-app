import {
  Controller, Get, Put, Body, Param, Query, Req,
  UseGuards, NotFoundException, ForbiddenException,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { UpsertRecordDto } from './dto/upsert-record.dto';
import { AiService } from '../ai/ai.service';

type Scope = 'me' | 'pair';

@UseGuards(AuthGuard)
@Controller('records')
export class RecordsController {
  constructor(
    private readonly records: RecordsService,
    private readonly aiService: AiService,
  ) {}

  /** 月次（カレンダー用） */
  @Get()
  async getMonthly(
    @Query('ym') ym: string,
    @Query('scope') scope: Scope = 'me',
    @Req() req: any,
  ) {
    const viewerId = Number(req.user.sub); // ★ .id → .sub
    const res = await this.records.getMonthly(ym, viewerId, scope);
    return res;
  }

  /** AI要約 - カレンダーより先に定義 */
  @Get('summary/:yearMonth')
  async getMonthlySummary(
    @Param('yearMonth') yearMonth: string,
    @Req() req: any,
  ) {
    const viewerId = Number(req.user.sub); // ★ .id → .sub
    
    // その月の詳細レコードを取得
    const records = await this.records.getMonthlyDetails(yearMonth, viewerId);
    
    // Gemini APIで要約生成
    const summary = await this.aiService.generateMonthlySummary(records);
    
    return { summary };
  }

  /** 詳細：自分 or ペア（?userId= 指定。未指定なら自分） */
  @Get(':date')
  async getByDate(
    @Param('date') date: string,
    @Query('userId') userId: string | undefined,
    @Req() req: any,
  ) {
    const viewerId = Number(req.user.sub); // ★ .id → .sub
    const targetUserId = userId ? Number(userId) : undefined;

    const data = await this.records.getByDateForUser(date, viewerId, targetUserId);
    if (!data) throw new NotFoundException();
    return data;
  }

  /** 保存：常に"自分"のみ（他人保存は 403） */
  @Put(':date')
  async upsert(
    @Param('date') date: string,
    @Body() body: UpsertRecordDto,
    @Req() req: any,
    @Query('userId') userId?: string,
  ) {
    console.log('DTO>', JSON.stringify(body));
    const viewerId = Number(req.user.sub); // ★ .id → .sub
    if (userId && Number(userId) !== viewerId) {
      throw new ForbiddenException('Cannot save other user record');
    }
    return this.records.upsert(date, viewerId, body);
  }
}