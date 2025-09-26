import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], //  これがないと AuthGuard が落ちる
  controllers: [PairsController],
  providers: [PairsService, PrismaService],
})
export class PairsModule {}