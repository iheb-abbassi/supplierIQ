import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { PurchaseRequest, RequestStatus } from '../entities/purchase-request.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { SupplierIssue } from '../entities/supplier-issue.entity';
import { SupplierRating } from '../entities/supplier-rating.entity';
import { SupplierSuggestion } from '../entities/supplier-suggestion.entity';
import { EventBusService } from '../common/event-bus/event-bus.service';
import { MatchingEngineService } from '../matching/matching-engine.service';
import { RiskEngineService } from '../risk/risk-engine.service';

/**
 * SuggestionsService
 *
 * Handles the generation and retrieval of supplier suggestions.
 * Listens to "RequestCreated" events and processes them asynchronously:
 * 1. Loads the purchase request
 * 2. Finds matching suppliers
 * 3. Computes match and risk scores
 * 4. Saves ranked suggestions
 */
@Injectable()
export class SuggestionsService implements OnModuleInit {
  private readonly logger = new Logger(SuggestionsService.name);

  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRequestRepository: Repository<PurchaseRequest>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(SupplierIssue)
    private readonly supplierIssueRepository: Repository<SupplierIssue>,
    @InjectRepository(SupplierRating)
    private readonly supplierRatingRepository: Repository<SupplierRating>,
    @InjectRepository(SupplierSuggestion)
    private readonly supplierSuggestionRepository: Repository<SupplierSuggestion>,
    private readonly eventBus: EventBusService,
    private readonly matchingEngine: MatchingEngineService,
    private readonly riskEngine: RiskEngineService,
  ) {}

  /**
   * Register event listener when module initializes
   */
  onModuleInit() {
    // Subscribe to RequestCreated events
    this.eventBus.on('RequestCreated', (payload) => {
      this.handleRequestCreated(payload);
    });

    this.logger.log('Subscribed to RequestCreated events');
  }

  /**
   * Handle the RequestCreated event
   * Generates supplier suggestions asynchronously
   *
   * @param payload - Event payload containing requestId
   */
  private async handleRequestCreated(payload: { requestId: string }) {
    const { requestId } = payload;

    this.logger.log(`Processing RequestCreated for request: ${requestId}`);

    try {
      // Step 1: Load the purchase request
      const request = await this.purchaseRequestRepository.findOne({
        where: { id: requestId },
      });

      if (!request) {
        this.logger.error(`Request not found: ${requestId}`);
        return;
      }

      // Update request status to processing
      await this.purchaseRequestRepository.update(requestId, {
        status: RequestStatus.PROCESSING,
      });

      // Step 2: Load all active suppliers that match the category
      const suppliers = await this.supplierRepository.find({
        where: {
          category: request.category,
          isActive: true,
        },
      });

      this.logger.log(
        `Found ${suppliers.length} suppliers for category: ${request.category}`,
      );

      // Step 3 & 4: Process each supplier and compute scores
      const suggestions: Array<{
        supplier: Supplier;
        matchScore: number;
        riskScore: number;
        explanation: string;
      }> = [];

      for (const supplier of suppliers) {
        // Get all orders for this supplier
        const allOrders = await this.purchaseOrderRepository.find({
          where: { supplierId: supplier.id },
        });

        // Count orders in the same category as the request
        const ordersInCategory = allOrders.filter(
          (order) => order.category.toLowerCase() === request.category.toLowerCase(),
        );

        // Get issues for this supplier
        const issues = await this.supplierIssueRepository.find({
          where: { supplierId: supplier.id },
        });

        // Get ratings for this supplier
        const ratings = await this.supplierRatingRepository.find({
          where: { supplierId: supplier.id },
        });

        // Compute match score
        const matchScore = this.matchingEngine.computeMatchScore(
          request,
          supplier,
          ordersInCategory.length,
        );

        // Compute risk score and explanation
        const { riskScore, explanation } = this.riskEngine.computeRiskScore(
          allOrders,
          issues,
          ratings,
        );

        suggestions.push({
          supplier,
          matchScore,
          riskScore,
          explanation,
        });
      }

      // Step 5: Sort by matchScore DESC, then by riskScore ASC
      suggestions.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore; // Higher match score first
        }
        return a.riskScore - b.riskScore; // Lower risk score first
      });

      // Step 6: Save suggestions with ranks
      const suggestionEntities = suggestions.map((s, index) => {
        return this.supplierSuggestionRepository.create({
          requestId: request.id,
          supplierId: s.supplier.id,
          matchScore: s.matchScore,
          riskScore: s.riskScore,
          explanation: s.explanation,
          rank: index + 1, // 1-based ranking
        });
      });

      await this.supplierSuggestionRepository.save(suggestionEntities);

      // Update request status to completed
      await this.purchaseRequestRepository.update(requestId, {
        status: RequestStatus.COMPLETED,
      });

      this.logger.log(
        `Generated ${suggestionEntities.length} suggestions for request: ${requestId}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing request ${requestId}: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Get suggestions for a purchase request
   * Returns suggestions sorted by rank (matchScore DESC, riskScore ASC)
   *
   * @param requestId - The purchase request UUID
   * @returns Array of SupplierSuggestion with supplier relation
   */
  async getSuggestionsByRequestId(
    requestId: string,
  ): Promise<SupplierSuggestion[]> {
    return this.supplierSuggestionRepository.find({
      where: { requestId },
      relations: ['supplier'],
      order: { rank: 'ASC' },
    });
  }
}
