import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Supplier } from './supplier.entity';

@Entity('supplier_ratings')
export class SupplierRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  supplierId: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number; // 0.00 to 5.00

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ nullable: true })
  category: string; // Category context for the rating

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.ratings)
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;
}
