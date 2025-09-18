import { Body, Controller, Get, Put, Query, Param, Req, UseGuards } from '@nestjs/common';
import { RecordsService } from './records.service';
import { GetRecordsDto } from './dto/get-records.dto';
import { UpsertRecordDto } from './dto/upsert-record.dto';
import { AuthGuard } from '../common/guards/auth.guard';


@Controller('records')
@UseGuards(AuthGuard)
export class RecordsController {
  constructor(private readonly records: RecordsService) {}

  @Get()
  async list(@Query() q: GetRecordsDto, @Req() req: any) {
    const meId = req.user.id as number;
    return this.records.findMonthly(q.ym, q.scope, meId);
  }

  @Put(':date') // :date = 'YYYY-MM-DD'
  async upsert(@Param('date') date: string, @Body() dto: UpsertRecordDto, @Req() req: any) {
    const meId = req.user.id as number;
    return this.records.upsertByDate(date, dto, meId);
  }
}