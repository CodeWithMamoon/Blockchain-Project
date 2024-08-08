import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChainsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllChains() {
    return this.prisma.chain.findMany();
  }

  async getChainTokens(chainId: number) {
    return this.prisma.token.findMany({
      where: { chainId },
    });
  }
}
