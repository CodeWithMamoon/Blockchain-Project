import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { getRoutes, RoutesRequest } from '@lifi/sdk';

@Injectable()
export class LifiService {
  private readonly logger = new Logger(LifiService.name);

  constructor(private readonly prisma: PrismaService) {}

  async fetchAndStoreRoutes() {
    try {
      const routesRequest: RoutesRequest = {
        fromChainId: 42161, // Arbitrum
        toChainId: 10, // Optimism
        fromTokenAddress: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC on Arbitrum
        toTokenAddress: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', // DAI on Optimism
        fromAmount: '10000000', // 10 USDC
      };

      const result = await getRoutes(routesRequest);
      const routes = result.routes;

      for (const route of routes) {
        // Create route in the database
        const createdRoute = await this.prisma.route.create({
          data: {
            fromChainId: route.fromChainId,
            toChainId: route.toChainId,
            fromAmountUSD: route.fromAmountUSD,
            fromAmount: route.fromAmount,
            fromToken: route.fromToken.address, // Assuming fromToken has an address field
            fromAddress: route.fromAddress || null,
            toAmountUSD: route.toAmountUSD,
            toAmount: route.toAmount,
            toAmountMin: route.toAmountMin,
            toToken: route.toToken.address, // Assuming toToken has an address field
            toAddress: route.toAddress || null,
            gasCostUSD: route.gasCostUSD || null,
            containsSwitchChain: route.containsSwitchChain || false,
          },
        });

        // Process each step in the route
        for (const step of route.steps) {
          await this.prisma.step.create({
            data: {
              action: JSON.stringify(step.action), // Assuming action is a JSON-serializable object
              executionDuration: step.executionDuration || 0, // Fallback to 0 if executionDuration is not present
              routeId: createdRoute.id, // Link the step to the created route
            },
          });
        }
      }

      this.logger.log('Routes and steps successfully stored.');
    } catch (error) {
      this.logger.error('Failed to fetch or store routes:', error);
    }
  }
}
