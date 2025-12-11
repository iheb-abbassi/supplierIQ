import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';
import { PurchaseRequest } from './purchase-request.entity';

@Entity('supplier_suggestions')
export class SupplierSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  requestId: string;

  @Column({ type: 'uuid' })
  supplierId: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  matchScore: number; // 0.0000 to 1.0000

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  riskScore: number; // 0.00 to 100.00

  @Column({ type: 'text' })
  explanation: string;

  @Column({ type: 'int', nullable: true })
  rank: number; // Position in the recommendation list

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => PurchaseRequest, (request) => request.suggestions)
  @JoinColumn({ name: 'requestId' })
  request: PurchaseRequest;

  @ManyToOne(() => Supplier, (supplier) => supplier.suggestions)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;
}
