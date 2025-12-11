import { DataSource } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { PurchaseOrder, OrderStatus } from '../entities/purchase-order.entity';
import { SupplierIssue, IssueType, IssueSeverity } from '../entities/supplier-issue.entity';
import { SupplierRating } from '../entities/supplier-rating.entity';
import { PurchaseRequest } from '../entities/purchase-request.entity';
import { SupplierSuggestion } from '../entities/supplier-suggestion.entity';

/**
 * Database Seed Script
 *
 * Populates the database with test data for development and testing.
 * Run with: npx ts-node src/database/seed.ts
 */

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'supplieriq',
  entities: [Supplier, PurchaseOrder, SupplierIssue, SupplierRating, PurchaseRequest, SupplierSuggestion],
  synchronize: false,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const supplierRepo = dataSource.getRepository(Supplier);
  const orderRepo = dataSource.getRepository(PurchaseOrder);
  const issueRepo = dataSource.getRepository(SupplierIssue);
  const ratingRepo = dataSource.getRepository(SupplierRating);

  // Clear existing data (use query builder to delete all)
  await ratingRepo.createQueryBuilder().delete().execute();
  await issueRepo.createQueryBuilder().delete().execute();
  await orderRepo.createQueryBuilder().delete().execute();
  await supplierRepo.createQueryBuilder().delete().execute();
  console.log('Cleared existing data');

  // ==========================================================================
  // CREATE SUPPLIERS
  // ==========================================================================
  const suppliers = await supplierRepo.save([
    // Metals suppliers
    {
      name: 'SteelPro Industries',
      category: 'metals',
      region: 'DE',
      description: 'Premium steel and aluminum supplier in Germany',
      isActive: true,
    },
    {
      name: 'MetalWorks GmbH',
      category: 'metals',
      region: 'DE',
      description: 'Specialized in aluminum casings and metal parts',
      isActive: true,
    },
    {
      name: 'Global Metals Ltd',
      category: 'metals',
      region: 'UK',
      description: 'International metals supplier',
      isActive: true,
    },
    {
      name: 'AlumniCorp',
      category: 'metals',
      region: 'US',
      description: 'US-based aluminum manufacturer',
      isActive: true,
    },
    // Electronics suppliers
    {
      name: 'TechParts Asia',
      category: 'electronics',
      region: 'CN',
      description: 'Electronic components manufacturer',
      isActive: true,
    },
    {
      name: 'CircuitBoard Pro',
      category: 'electronics',
      region: 'DE',
      description: 'German electronics supplier',
      isActive: true,
    },
    // Plastics suppliers
    {
      name: 'PolymerTech',
      category: 'plastics',
      region: 'DE',
      description: 'Industrial plastics and polymers',
      isActive: true,
    },
    {
      name: 'PlastiCo International',
      category: 'plastics',
      region: 'US',
      description: 'US plastics manufacturer',
      isActive: true,
    },
  ]);

  console.log(`Created ${suppliers.length} suppliers`);

  // Helper to get supplier by name
  const getSupplier = (name: string) => suppliers.find((s) => s.name === name)!;

  // ==========================================================================
  // CREATE PURCHASE ORDERS (Historical data)
  // ==========================================================================
  const orders = await orderRepo.save([
    // SteelPro Industries - Excellent supplier (many orders, no late deliveries)
    {
      supplierId: getSupplier('SteelPro Industries').id,
      category: 'metals',
      quantity: 5000,
      unitPrice: 2.5,
      totalPrice: 12500,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-01-15'),
      actualDeliveryDate: new Date('2024-01-14'),
      isLate: false,
    },
    {
      supplierId: getSupplier('SteelPro Industries').id,
      category: 'metals',
      quantity: 8000,
      unitPrice: 2.4,
      totalPrice: 19200,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-02-20'),
      actualDeliveryDate: new Date('2024-02-18'),
      isLate: false,
    },
    {
      supplierId: getSupplier('SteelPro Industries').id,
      category: 'metals',
      quantity: 10000,
      unitPrice: 2.3,
      totalPrice: 23000,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-03-10'),
      actualDeliveryDate: new Date('2024-03-10'),
      isLate: false,
    },
    {
      supplierId: getSupplier('SteelPro Industries').id,
      category: 'metals',
      quantity: 7500,
      unitPrice: 2.45,
      totalPrice: 18375,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-04-05'),
      actualDeliveryDate: new Date('2024-04-04'),
      isLate: false,
    },
    {
      supplierId: getSupplier('SteelPro Industries').id,
      category: 'metals',
      quantity: 12000,
      unitPrice: 2.35,
      totalPrice: 28200,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-05-15'),
      actualDeliveryDate: new Date('2024-05-15'),
      isLate: false,
    },

    // MetalWorks GmbH - Good supplier (some orders, 1 late delivery)
    {
      supplierId: getSupplier('MetalWorks GmbH').id,
      category: 'metals',
      quantity: 3000,
      unitPrice: 2.8,
      totalPrice: 8400,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-01-20'),
      actualDeliveryDate: new Date('2024-01-22'), // Late
      isLate: true,
    },
    {
      supplierId: getSupplier('MetalWorks GmbH').id,
      category: 'metals',
      quantity: 5000,
      unitPrice: 2.7,
      totalPrice: 13500,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-02-25'),
      actualDeliveryDate: new Date('2024-02-24'),
      isLate: false,
    },
    {
      supplierId: getSupplier('MetalWorks GmbH').id,
      category: 'metals',
      quantity: 6000,
      unitPrice: 2.75,
      totalPrice: 16500,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-04-10'),
      actualDeliveryDate: new Date('2024-04-09'),
      isLate: false,
    },

    // Global Metals Ltd - Average supplier (some late deliveries, issues)
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      category: 'metals',
      quantity: 4000,
      unitPrice: 2.2,
      totalPrice: 8800,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-02-01'),
      actualDeliveryDate: new Date('2024-02-05'), // Late
      isLate: true,
    },
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      category: 'metals',
      quantity: 5000,
      unitPrice: 2.6,
      totalPrice: 13000,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-03-15'),
      actualDeliveryDate: new Date('2024-03-20'), // Late
      isLate: true,
    },
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      category: 'metals',
      quantity: 3500,
      unitPrice: 2.4,
      totalPrice: 8400,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-04-20'),
      actualDeliveryDate: new Date('2024-04-19'),
      isLate: false,
    },

    // AlumniCorp - New supplier (few orders)
    {
      supplierId: getSupplier('AlumniCorp').id,
      category: 'metals',
      quantity: 2000,
      unitPrice: 2.9,
      totalPrice: 5800,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-05-01'),
      actualDeliveryDate: new Date('2024-05-01'),
      isLate: false,
    },

    // TechParts Asia - Electronics orders
    {
      supplierId: getSupplier('TechParts Asia').id,
      category: 'electronics',
      quantity: 10000,
      unitPrice: 0.5,
      totalPrice: 5000,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-03-01'),
      actualDeliveryDate: new Date('2024-03-01'),
      isLate: false,
    },
    {
      supplierId: getSupplier('TechParts Asia').id,
      category: 'electronics',
      quantity: 15000,
      unitPrice: 0.45,
      totalPrice: 6750,
      status: OrderStatus.DELIVERED,
      expectedDeliveryDate: new Date('2024-04-01'),
      actualDeliveryDate: new Date('2024-04-03'), // Late
      isLate: true,
    },
  ]);

  console.log(`Created ${orders.length} purchase orders`);

  // ==========================================================================
  // CREATE SUPPLIER ISSUES
  // ==========================================================================
  const issues = await issueRepo.save([
    // Global Metals Ltd - Has issues
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      type: IssueType.DELIVERY,
      severity: IssueSeverity.MEDIUM,
      description: 'Shipment arrived 5 days late due to logistics issues',
      resolved: true,
      resolvedAt: new Date('2024-02-10'),
    },
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      type: IssueType.QUALITY,
      severity: IssueSeverity.LOW,
      description: 'Minor surface defects on 2% of batch',
      resolved: true,
      resolvedAt: new Date('2024-03-25'),
    },

    // MetalWorks GmbH - Minor issue
    {
      supplierId: getSupplier('MetalWorks GmbH').id,
      type: IssueType.COMMUNICATION,
      severity: IssueSeverity.LOW,
      description: 'Delayed response to order confirmation',
      resolved: true,
      resolvedAt: new Date('2024-01-25'),
    },

    // TechParts Asia - Has an issue
    {
      supplierId: getSupplier('TechParts Asia').id,
      type: IssueType.DELIVERY,
      severity: IssueSeverity.LOW,
      description: 'Customs delay caused late delivery',
      resolved: true,
      resolvedAt: new Date('2024-04-05'),
    },
  ]);

  console.log(`Created ${issues.length} supplier issues`);

  // ==========================================================================
  // CREATE SUPPLIER RATINGS
  // ==========================================================================
  const ratings = await ratingRepo.save([
    // SteelPro Industries - Excellent ratings
    {
      supplierId: getSupplier('SteelPro Industries').id,
      rating: 5.0,
      comment: 'Excellent quality and on-time delivery',
      category: 'metals',
    },
    {
      supplierId: getSupplier('SteelPro Industries').id,
      rating: 4.8,
      comment: 'Great service, competitive pricing',
      category: 'metals',
    },
    {
      supplierId: getSupplier('SteelPro Industries').id,
      rating: 4.9,
      comment: 'Reliable partner for large orders',
      category: 'metals',
    },

    // MetalWorks GmbH - Good ratings
    {
      supplierId: getSupplier('MetalWorks GmbH').id,
      rating: 4.2,
      comment: 'Good quality products',
      category: 'metals',
    },
    {
      supplierId: getSupplier('MetalWorks GmbH').id,
      rating: 4.0,
      comment: 'Decent service, slight delays sometimes',
      category: 'metals',
    },

    // Global Metals Ltd - Mixed ratings
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      rating: 3.5,
      comment: 'Competitive pricing but delivery issues',
      category: 'metals',
    },
    {
      supplierId: getSupplier('Global Metals Ltd').id,
      rating: 3.0,
      comment: 'Quality inconsistent between batches',
      category: 'metals',
    },

    // AlumniCorp - New, limited ratings
    {
      supplierId: getSupplier('AlumniCorp').id,
      rating: 4.5,
      comment: 'Promising new supplier',
      category: 'metals',
    },

    // TechParts Asia - Good ratings
    {
      supplierId: getSupplier('TechParts Asia').id,
      rating: 4.3,
      comment: 'Good quality electronics components',
      category: 'electronics',
    },
    {
      supplierId: getSupplier('TechParts Asia').id,
      rating: 4.0,
      comment: 'Reliable for bulk orders',
      category: 'electronics',
    },

    // CircuitBoard Pro - Excellent
    {
      supplierId: getSupplier('CircuitBoard Pro').id,
      rating: 4.7,
      comment: 'High quality German engineering',
      category: 'electronics',
    },

    // PolymerTech
    {
      supplierId: getSupplier('PolymerTech').id,
      rating: 4.4,
      comment: 'Reliable plastics supplier',
      category: 'plastics',
    },
  ]);

  console.log(`Created ${ratings.length} supplier ratings`);

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log('\n========================================');
  console.log('SEED COMPLETE');
  console.log('========================================');
  console.log(`Suppliers: ${suppliers.length}`);
  console.log(`Purchase Orders: ${orders.length}`);
  console.log(`Issues: ${issues.length}`);
  console.log(`Ratings: ${ratings.length}`);
  console.log('\nSuppliers by category:');
  console.log('  - metals: 4 (SteelPro, MetalWorks, Global Metals, AlumniCorp)');
  console.log('  - electronics: 2 (TechParts Asia, CircuitBoard Pro)');
  console.log('  - plastics: 2 (PolymerTech, PlastiCo International)');

  await dataSource.destroy();
  console.log('\nDatabase connection closed');
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
