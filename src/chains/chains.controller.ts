import { Controller, Get, Param } from '@nestjs/common';
import { ChainsService } from './chains.service';

@Controller('chains')
export class ChainsController {
  constructor(private readonly chainsService: ChainsService) {}

  @Get()
  async getAllChains() {
    return this.chainsService.getAllChains();
  }

  @Get(':chainId/tokens')
  async getChainTokens(@Param('chainId') chainId: number) {
    return this.chainsService.getChainTokens(Number(chainId));
  }
}
