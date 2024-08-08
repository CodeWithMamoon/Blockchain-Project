import { Module } from '@nestjs/common';
import { ChainsService } from './chains.service';
import { ChainsController } from './chains.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [ChainsService, PrismaService],
  controllers: [ChainsController],
})
export class ChainsModule {}
