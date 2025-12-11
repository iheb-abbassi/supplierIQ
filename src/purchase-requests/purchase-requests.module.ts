import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseRequest } from '../entities/purchase-request.entity';
import { PurchaseRequestsService } from './purchase-requests.service';
import { PurchaseRequestsController } from './purchase-requests.controller';

/**
 * PurchaseRequestsModule
 *
 * Handles purchase request creation and retrieval.
 * When a request is created, it emits a "RequestCreated" event
 * that triggers supplier matching in the SupplierEvalModule.
 */
@Module({
  imports: [TypeOrmModule.forFeature([PurchaseRequest])],
  controllers: [PurchaseRequestsController],
  providers: [PurchaseRequestsService],
  exports: [PurchaseRequestsService],
})
export class PurchaseRequestsModule {}
