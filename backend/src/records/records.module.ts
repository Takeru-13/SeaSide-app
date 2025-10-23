import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { AuthGuard } from '../common/guards/auth.guard';

@Module({
  imports: [PrismaModule, AuthModule, AiModule],
  controllers: [RecordsController],
  providers: [RecordsService, AuthGuard],
})
export class RecordsModule {}
