import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { PairsService } from './pairs.service';
import { IsAlphanumeric, IsString, Length } from 'class-validator';

class ConnectDto {
  @IsString()
  @IsAlphanumeric()
  @Length(6, 6)
  code!: string;
}

@UseGuards(AuthGuard)
@Controller('pair')
export class PairsController {
  constructor(private readonly service: PairsService) {}

  /** 招待コードを発行 */
  @Post('invite')
  async invite(@Req() req: any) {
    const meId = Number(req.user?.sub); // ★ .id → .sub
    const { code, expiresAt } = await this.service.createInvite(meId);
    return { code, expiresAt };
  }

  /** コードで接続 */
  @Post('connect')
  async connect(@Req() req: any, @Body() dto: ConnectDto) {
    const meId = Number(req.user?.sub); // ★ .id → .sub
    const result = await this.service.connectWithCode(meId, dto.code);
    if (!result.connected) throw new BadRequestException('connect failed');
    return result; // { connected:true, partner:{ id, displayName? } }
  }

  /** 接続状態 */
  @Get('status')
  async status(@Req() req: any) {
    const meId = Number(req.user?.sub); // ★ .id → .sub
    console.log('🔍 Pair status check - meId:', meId);
    console.log('🔍 req.user:', req.user);
    
    const status = await this.service.getStatus(meId);
    console.log('🔍 Pair status result:', status);
    
    return status; // { connected:false } | { connected:true, partner:{...} }
  }
}