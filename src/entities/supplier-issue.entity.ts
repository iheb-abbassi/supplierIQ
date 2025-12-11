import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

export enum IssueSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IssueType {
  QUALITY = 'quality',
  DELIVERY = 'delivery',
  COMMUNICATION = 'communication',
  PRICING = 'pricing',
  OTHER = 'other',
}

@Entity('supplier_issues')
export class SupplierIssue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  supplierId: string;

  @Column({ type: 'enum', enum: IssueType })
  type: IssueType;

  @Column({ type: 'enum', enum: IssueSeverity, default: IssueSeverity.MEDIUM })
  severity: IssueSeverity;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: false })
  resolved: boolean;

  @Column({ type: 'date', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.issues)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;
}
