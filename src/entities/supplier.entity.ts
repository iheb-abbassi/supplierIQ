import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { SupplierIssue } from './supplier-issue.entity';
import { SupplierRating } from './supplier-rating.entity';
import { SupplierSuggestion } from './supplier-suggestion.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column()
  region: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  orders: PurchaseOrder[];

  @OneToMany(() => SupplierIssue, (issue) => issue.supplier)
  issues: SupplierIssue[];

  @OneToMany(() => SupplierRating, (rating) => rating.supplier)
  ratings: SupplierRating[];

  @OneToMany(() => SupplierSuggestion, (suggestion) => suggestion.supplier)
  suggestions: SupplierSuggestion[];
}
