import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LifiService } from './lifi/lifi.service';
import { PrismaService } from './prisma/prisma.service';
import { ChainsModule } from './chains/chains.module';

@Module({
  imports: [ScheduleModule.forRoot(), ChainsModule],
  providers: [LifiService, PrismaService],
})
export class AppModule {}
