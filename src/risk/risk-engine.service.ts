import { Injectable } from '@nestjs/common';
import { PurchaseOrder } from '../entities/purchase-order.entity';
import { SupplierIssue } from '../entities/supplier-issue.entity';
import { SupplierRating } from '../entities/supplier-rating.entity';

/**
 * RiskEngineService
 *
 * Computes a risk score (0–100) for a supplier based on historical data.
 * Lower scores indicate lower risk (better suppliers).
 *
 * Risk factors and their weights:
 * - Late delivery rate (40%)
 * - Issue frequency (30%)
 * - Average rating inverted (20%)
 * - Price volatility (10%)
 */
@Injectable()
export class RiskEngineService {
  /**
   * Compute the risk score for a supplier based on their historical performance.
   *
   * @param orders - All purchase orders from this supplier
   * @param issues - All recorded issues with this supplier
   * @param ratings - All ratings for this supplier
   * @returns Object containing riskScore (0-100) and explanation string
   */
  computeRiskScore(
    orders: PurchaseOrder[],
    issues: SupplierIssue[],
    ratings: SupplierRating[],
  ): { riskScore: number; explanation: string } {
    const explanationParts: string[] = [];

    // =========================================================================
    // LATE DELIVERY RATE (40% weight)
    // Proportion of orders that were delivered late
    // =========================================================================
    let lateDeliveryRate = 0;
    if (orders.length > 0) {
      const lateOrders = orders.filter((order) => order.isLate).length;
      lateDeliveryRate = lateOrders / orders.length;
    }

    // Generate explanation for delivery performance
    const onTimeRate = ((1 - lateDeliveryRate) * 100).toFixed(1);
    if (lateDeliveryRate === 0) {
      explanationParts.push(`Excellent delivery record: ${onTimeRate}% on-time`);
    } else if (lateDeliveryRate < 0.1) {
      explanationParts.push(`Good delivery record: ${onTimeRate}% on-time`);
    } else if (lateDeliveryRate < 0.25) {
      explanationParts.push(`Fair delivery record: ${onTimeRate}% on-time`);
    } else {
      explanationParts.push(`Poor delivery record: only ${onTimeRate}% on-time`);
    }

    // =========================================================================
    // NORMALIZED ISSUE SCORE (30% weight)
    // Issue frequency relative to order volume
    // Formula: min((issues.length / max(orders.length, 1)) / 0.5, 1)
    // - 0 issues => 0.0 score
    // - issues = 25% of orders => 0.5 score
    // - issues >= 50% of orders => 1.0 score (max)
    // =========================================================================
    const issueRatio = issues.length / Math.max(orders.length, 1);
    const normalizedIssueScore = Math.min(issueRatio / 0.5, 1);

    // Generate explanation for issue frequency
    if (issues.length === 0) {
      explanationParts.push('No recorded issues');
    } else if (normalizedIssueScore < 0.3) {
      explanationParts.push(`Low issue frequency: ${issues.length} issues across ${orders.length} orders`);
    } else if (normalizedIssueScore < 0.6) {
      explanationParts.push(`Moderate issue frequency: ${issues.length} issues across ${orders.length} orders`);
    } else {
      explanationParts.push(`High issue frequency: ${issues.length} issues across ${orders.length} orders`);
    }

    // =========================================================================
    // NORMALIZED RATING (20% weight)
    // Inverted rating scale: rating 5 => 0 risk, rating 1 => 1 risk
    // Formula: (5 - avgRating) / 4
    // =========================================================================
    let normalizedRating = 0.5; // Default for suppliers with no ratings
    let avgRating = 0;

    if (ratings.length > 0) {
      // Calculate average rating
      const totalRating = ratings.reduce(
        (sum, r) => sum + Number(r.rating),
        0,
      );
      avgRating = totalRating / ratings.length;
      // Convert to risk score (5 star => 0 risk, 1 star => 1 risk)
      normalizedRating = (5 - avgRating) / 4;
    }

    // Generate explanation for rating
    if (ratings.length === 0) {
      explanationParts.push('No ratings available (neutral risk assumed)');
    } else if (avgRating >= 4.5) {
      explanationParts.push(`Excellent average rating: ${avgRating.toFixed(2)}/5`);
    } else if (avgRating >= 3.5) {
      explanationParts.push(`Good average rating: ${avgRating.toFixed(2)}/5`);
    } else if (avgRating >= 2.5) {
      explanationParts.push(`Fair average rating: ${avgRating.toFixed(2)}/5`);
    } else {
      explanationParts.push(`Poor average rating: ${avgRating.toFixed(2)}/5`);
    }

    // =========================================================================
    // NORMALIZED VOLATILITY (10% weight)
    // Based on price variation across orders
    // Formula: volatility = (maxPrice - minPrice) / max(minPrice, 1)
    //          normalizedVolatility = clamp(volatility / 0.5, 0, 1)
    // =========================================================================
    let normalizedVolatility = 0;

    if (orders.length > 1) {
      // Extract unit prices from orders
      const prices = orders.map((order) => Number(order.unitPrice));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      // Calculate volatility as percentage of min price
      const volatility = (maxPrice - minPrice) / Math.max(minPrice, 1);
      // Normalize: 50% price variation = max risk score of 1
      normalizedVolatility = Math.min(Math.max(volatility / 0.5, 0), 1);

      // Add warning if volatility is significant
      if (normalizedVolatility > 0.5) {
        const volatilityPercent = (volatility * 100).toFixed(1);
        explanationParts.push(`Warning: High price volatility (${volatilityPercent}% variation)`);
      } else if (normalizedVolatility > 0.2) {
        const volatilityPercent = (volatility * 100).toFixed(1);
        explanationParts.push(`Note: Moderate price volatility (${volatilityPercent}% variation)`);
      }
    }

    // =========================================================================
    // FINAL RISK SCORE
    // Weighted combination of all four components, scaled to 0-100
    // =========================================================================
    const riskScore_0_1 =
      0.4 * lateDeliveryRate +
      0.3 * normalizedIssueScore +
      0.2 * normalizedRating +
      0.1 * normalizedVolatility;

    const riskScore = Math.round(riskScore_0_1 * 100);

    // Build final explanation
    const explanation = explanationParts.join('. ') + '.';

    return {
      riskScore,
      explanation,
    };
  }
}
