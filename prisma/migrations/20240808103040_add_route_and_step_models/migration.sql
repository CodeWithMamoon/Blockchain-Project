-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "fromChainId" INTEGER NOT NULL,
    "toChainId" INTEGER NOT NULL,
    "fromAmountUSD" TEXT NOT NULL,
    "fromAmount" TEXT NOT NULL,
    "fromToken" TEXT NOT NULL,
    "fromAddress" TEXT,
    "toAmountUSD" TEXT NOT NULL,
    "toAmount" TEXT NOT NULL,
    "toAmountMin" TEXT NOT NULL,
    "toToken" TEXT NOT NULL,
    "toAddress" TEXT,
    "gasCostUSD" TEXT,
    "containsSwitchChain" BOOLEAN NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Step" (
    "id" SERIAL NOT NULL,
    "action" TEXT NOT NULL,
    "executionDuration" INTEGER NOT NULL,
    "routeId" INTEGER NOT NULL,

    CONSTRAINT "Step_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Step" ADD CONSTRAINT "Step_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
