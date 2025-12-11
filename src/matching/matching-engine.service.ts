import { Injectable } from '@nestjs/common';
import { Supplier } from '../entities/supplier.entity';
import { PurchaseRequest } from '../entities/purchase-request.entity';

/**
 * MatchingEngineService
 *
 * Computes a match score (0–1) between a supplier and a purchase request.
 * The score indicates how well a supplier fits the request based on:
 * - Category match (50% weight)
 * - Region match (20% weight)
 * - Experience in category (30% weight)
 */
@Injectable()
export class MatchingEngineService {
  /**
   * Compute the match score between a purchase request and a supplier.
   *
   * @param request - The purchase request to match against
   * @param supplier - The supplier being evaluated
   * @param ordersInCategoryCount - Number of past orders this supplier has fulfilled in the request's category
   * @returns A match score between 0 and 1 (higher is better)
   */
  computeMatchScore(
    request: PurchaseRequest,
    supplier: Supplier,
    ordersInCategoryCount: number,
  ): number {
    // =========================================================================
    // CATEGORY SCORE (50% weight)
    // Binary match: 1 if supplier's category matches request category, else 0
    // =========================================================================
    const categoryScore =
      supplier.category.toLowerCase() === request.category.toLowerCase()
        ? 1
        : 0;

    // =========================================================================
    // REGION SCORE (20% weight)
    // Binary match: 1 if supplier's region matches request region, else 0
    // =========================================================================
    const regionScore =
      supplier.region.toLowerCase() === request.region.toLowerCase() ? 1 : 0;

    // =========================================================================
    // EXPERIENCE SCORE (30% weight)
    // Based on number of past orders in the category, capped at 10
    // - 0 orders => 0.0 score
    // - 5 orders => 0.5 score
    // - 10+ orders => 1.0 score (max)
    // =========================================================================
    const experienceScore = Math.min(ordersInCategoryCount / 10, 1);

    // =========================================================================
    // FINAL MATCH SCORE
    // Weighted combination of all three components
    // =========================================================================
    const matchScore =
      0.5 * categoryScore + 0.2 * regionScore + 0.3 * experienceScore;

    return matchScore;
  }
}
