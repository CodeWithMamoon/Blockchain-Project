import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class LifiService {
  private readonly logger = new Logger(LifiService.name);
  private readonly lifiApiBase = 'https://api.lifi.app';

  constructor(private readonly prisma: PrismaService) {}

  @Cron('* * * * *') 
  async handleCron() {
    this.logger.debug('Cron job started');
    await this.storeChains();
  }

  async storeChains() {
    try {
      const response = await axios.get(`${this.lifiApiBase}/getChains`);
      const chains = response.data;
      this.logger.debug(`Fetched chains: ${JSON.stringify(chains)}`);
      
      for (const chain of chains) {
        await this.prisma.chain.upsert({
          where: { chainId: chain.chainId },
          update: { name: chain.name },
          create: {
            chainId: chain.chainId,
            name: chain.name,
          },
        });

        this.logger.debug(`Stored chain: ${JSON.stringify(chain)}`);
        await this.storeTokens(chain.chainId);
      }
    } catch (error) {
      this.logger.error('Error fetching chains:', error);
    }
  }

  async storeTokens(chainId: number) {
    try {
      const response = await axios.get(`${this.lifiApiBase}/getChainTokens`, {
        params: { chainId },
      });
      const tokens = response.data;
      this.logger.debug(`Fetched tokens for chainId ${chainId}: ${JSON.stringify(tokens)}`);
      
      for (const token of tokens) {
        const existingToken = await this.prisma.token.findFirst({
          where: {
            symbol: token.symbol,
            chainId: chainId,
          },
        });

        if (existingToken) {
          await this.prisma.token.update({
            where: { id: existingToken.id },
            data: {
              name: token.name,
              symbol: token.symbol,
              chainId: chainId,
            },
          });
          this.logger.debug(`Updated token: ${JSON.stringify(token)}`);
        } else {
          await this.prisma.token.create({
            data: {
              name: token.name,
              symbol: token.symbol,
              chainId: chainId,
            },
          });
          this.logger.debug(`Created token: ${JSON.stringify(token)}`);
        }
      }
    } catch (error) {
      this.logger.error(`Error fetching tokens for chainId ${chainId}:`, error);
    }
  }
}
