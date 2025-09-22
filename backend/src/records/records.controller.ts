import { Body, Controller, Get, Put, Param, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RecordsService } from './records.service';
import { UpsertRecordDto } from './dto/upsert-record.dto';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('records')
@UseGuards(AuthGuard)
export class RecordsController {
  constructor(private readonly service: RecordsService) {}

  // 月次（カレンダー/グラフ用）
  @Get()
  findMonthly(@Req() req: any, @Query('ym') ym: string, @Query('scope') scope: 'me'|'pair' = 'me') {
    const meId = req.user?.id as number;
    return this.service.findMonthly(ym, scope, meId);
  }

  @Get(':date')
  findOne(@Param('date') date: string, @Req() req: any) {
  const meId = req.user?.id as number;
  return this.service.findOneByDate(date, meId);
}

  // 1日保存（厳格チェック。フロントは正しい型で送る前提）
  @Put(':date')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: false }))
  upsertByDate(@Param('date') date: string, @Body() dto: UpsertRecordDto, @Req() req: any) {
    const meId = req.user?.id as number;
    return this.service.upsertByDate(date, dto, meId);
  }
}
