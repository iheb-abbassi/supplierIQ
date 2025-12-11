import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseRequest } from '../entities/purchase-request.entity';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import { EventBusService } from '../common/event-bus/event-bus.service';

/**
 * PurchaseRequestsService
 *
 * Handles business logic for purchase requests:
 * - Creating new requests
 * - Emitting events for async processing
 * - Retrieving request data
 */
@Injectable()
export class PurchaseRequestsService {
  constructor(
    @InjectRepository(PurchaseRequest)
    private readonly purchaseRequestRepository: Repository<PurchaseRequest>,
    private readonly eventBus: EventBusService,
  ) {}

  /**
   * Create a new purchase request
   *
   * Flow:
   * 1. Save the request to the database
   * 2. Emit "RequestCreated" event for background processing
   * 3. Return the created request
   *
   * @param dto - The purchase request data
   * @returns The created PurchaseRequest entity
   */
  async create(dto: CreatePurchaseRequestDto): Promise<PurchaseRequest> {
    // Create entity instance from DTO
    const purchaseRequest = this.purchaseRequestRepository.create(dto);

    // Save to database
    const savedRequest = await this.purchaseRequestRepository.save(purchaseRequest);

    // Emit event for background processing (supplier matching)
    // The SupplierEvalModule will listen for this event and
    // generate supplier suggestions asynchronously
    this.eventBus.emit('RequestCreated', {
      requestId: savedRequest.id,
    });

    return savedRequest;
  }

  /**
   * Find a purchase request by ID
   *
   * @param id - The request UUID
   * @returns The PurchaseRequest or null if not found
   */
  async findById(id: string): Promise<PurchaseRequest | null> {
    return this.purchaseRequestRepository.findOne({
      where: { id },
    });
  }

  /**
   * Find a purchase request by ID with its suggestions
   *
   * @param id - The request UUID
   * @returns The PurchaseRequest with suggestions relation loaded
   */
  async findByIdWithSuggestions(id: string): Promise<PurchaseRequest | null> {
    return this.purchaseRequestRepository.findOne({
      where: { id },
      relations: ['suggestions', 'suggestions.supplier'],
    });
  }
}
