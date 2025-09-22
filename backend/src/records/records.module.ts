import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from '../common/guards/auth.guard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RecordsController],
  providers: [RecordsService, AuthGuard],
})
export class RecordsModule {}
