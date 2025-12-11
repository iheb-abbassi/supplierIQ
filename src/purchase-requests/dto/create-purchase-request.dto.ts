import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { Urgency } from '../../entities/purchase-request.entity';

/**
 * DTO for creating a new purchase request
 *
 * Validates incoming request data before processing.
 * All fields except urgency are required.
 */
export class CreatePurchaseRequestDto {
  /**
   * Category of items being requested (e.g., "Electronics", "Office Supplies")
   */
  @IsString()
  @IsNotEmpty()
  category: string;

  /**
   * Detailed description of the purchase request
   */
  @IsString()
  @IsNotEmpty()
  description: string;

  /**
   * Number of items/units requested
   */
  @IsNumber()
  @IsPositive()
  quantity: number;

  /**
   * Maximum budget for this purchase (in currency units)
   */
  @IsNumber()
  @Min(0)
  budget: number;

  /**
   * Urgency level of the request
   * Defaults to MEDIUM if not specified
   */
  @IsEnum(Urgency)
  @IsOptional()
  urgency?: Urgency;

  /**
   * Geographic region for the purchase (e.g., "North America", "Europe")
   */
  @IsString()
  @IsNotEmpty()
  region: string;
}
