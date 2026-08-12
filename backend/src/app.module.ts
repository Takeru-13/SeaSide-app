import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { RecordsModule } from './records/records.module';

import { PairsModule } from './pairs/pairs.module';

import { UsersModule } from './users/users.module'; 

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    RecordsModule,
    PairsModule, 
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
