import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SupplierSuggestion } from '../entities/supplier-suggestion.entity';

/**
 * SuggestionsController
 *
 * REST API endpoint for retrieving supplier suggestions:
 * - GET /requests/:id/suggestions - Get ranked suggestions for a request
 */
@Controller('requests')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  /**
   * Get supplier suggestions for a purchase request
   *
   * GET /requests/:id/suggestions
   *
   * Returns suggestions sorted by:
   * 1. matchScore DESC (best matches first)
   * 2. riskScore ASC (lowest risk first, as tiebreaker)
   *
   * @param id - The purchase request UUID
   * @returns Array of SupplierSuggestion with supplier details
   */
  @Get(':id/suggestions')
  async getSuggestions(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierSuggestion[]> {
    const suggestions = await this.suggestionsService.getSuggestionsByRequestId(id);

    // Return empty array if no suggestions found
    // This could mean the request doesn't exist or is still processing
    return suggestions;
  }
}
