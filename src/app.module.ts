import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Supplier,
  PurchaseRequest,
  PurchaseOrder,
  SupplierIssue,
  SupplierRating,
  SupplierSuggestion,
} from './entities';
import { EventBusModule } from './common/event-bus';
import { MatchingModule } from './matching';
import { RiskModule } from './risk';
import { PurchaseRequestsModule } from './purchase-requests';
import { SuggestionsModule } from './suggestions';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'supplieriq',
      entities: [
        Supplier,
        PurchaseRequest,
        PurchaseOrder,
        SupplierIssue,
        SupplierRating,
        SupplierSuggestion,
      ],
      synchronize: process.env.NODE_ENV !== 'production', // Auto-sync schema in dev
      logging: process.env.NODE_ENV !== 'production',
    }),
    // Global event bus for inter-module communication
    EventBusModule,
    // Core scoring engines
    MatchingModule,
    RiskModule,
    // Feature modules
    PurchaseRequestsModule,
    SuggestionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
