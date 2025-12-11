import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  NotFoundException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PurchaseRequestsService } from './purchase-requests.service';
import { CreatePurchaseRequestDto } from './dto/create-purchase-request.dto';
import { PurchaseRequest } from '../entities/purchase-request.entity';

/**
 * PurchaseRequestsController
 *
 * REST API endpoints for purchase requests:
 * - POST /requests - Create a new purchase request
 * - GET /requests/:id - Get a purchase request by ID
 */
@Controller('requests')
export class PurchaseRequestsController {
  constructor(
    private readonly purchaseRequestsService: PurchaseRequestsService,
  ) {}

  /**
   * Create a new purchase request
   *
   * POST /requests
   *
   * Flow:
   * 1. Validate request body using DTO
   * 2. Save request to database
   * 3. Emit "RequestCreated" event (triggers supplier matching)
   * 4. Return created request
   *
   * @param dto - The purchase request data
   * @returns The created PurchaseRequest
   */
  @Post()
  async create(
    @Body() dto: CreatePurchaseRequestDto,
  ): Promise<PurchaseRequest> {
    return this.purchaseRequestsService.create(dto);
  }

  /**
   * Get a purchase request by ID
   *
   * GET /requests/:id
   *
   * @param id - The request UUID
   * @returns The PurchaseRequest
   * @throws NotFoundException if request not found
   */
  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PurchaseRequest> {
    const request = await this.purchaseRequestsService.findById(id);

    if (!request) {
      throw new NotFoundException(`Purchase request with ID "${id}" not found`);
    }

    return request;
  }
}
