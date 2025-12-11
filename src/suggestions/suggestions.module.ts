import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../entities/supplier.entity';
import { PurchaseRequest } from '../entities/purchase-request.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { SupplierIssue } from '../entities/supplier-issue.entity';
import { SupplierRating } from '../entities/supplier-rating.entity';
import { SupplierSuggestion } from '../entities/supplier-suggestion.entity';
import { MatchingModule } from '../matching/matching.module';
import { RiskModule } from '../risk/risk.module';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';

/**
 * SuggestionsModule
 *
 * Handles supplier suggestion generation and retrieval.
 *
 * Listens to "RequestCreated" events and:
 * 1. Loads the purchase request
 * 2. Finds matching suppliers
 * 3. Computes match scores (MatchingEngineService)
 * 4. Computes risk scores (RiskEngineService)
 * 5. Saves ranked SupplierSuggestion records
 *
 * Provides GET /requests/:id/suggestions endpoint
 */
@Module({
  imports: [
    // Register all entities needed for suggestion generation
    TypeOrmModule.forFeature([
      Supplier,
      PurchaseRequest,
      PurchaseOrder,
      SupplierIssue,
      SupplierRating,
      SupplierSuggestion,
    ]),
    // Import scoring engines
    MatchingModule,
    RiskModule,
  ],
  controllers: [SuggestionsController],
  providers: [SuggestionsService],
  exports: [SuggestionsService],
})
export class SuggestionsModule {}
