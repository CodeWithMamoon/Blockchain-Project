import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LifiService } from './lifi/lifi.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [LifiService, PrismaService],
})
export class AppModule {}
