import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SupplierSuggestion } from './supplier-suggestion.entity';

export enum RequestStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Urgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('purchase_requests')
export class PurchaseRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  category: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: Urgency, default: Urgency.MEDIUM })
  urgency: Urgency;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  budget: number;

  @Column()
  region: string;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => SupplierSuggestion, (suggestion) => suggestion.request)
  suggestions: SupplierSuggestion[];
}
