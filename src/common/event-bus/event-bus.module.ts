import { Global, Module } from '@nestjs/common';
import { EventBusService } from './event-bus.service';

/**
 * EventBusModule
 *
 * Provides the EventBusService as a global singleton.
 * The @Global() decorator makes this module available throughout
 * the application without needing to import it in every module.
 *
 * Import this module once in AppModule to enable event-driven
 * communication across all modules.
 */
@Global()
@Module({
  providers: [EventBusService],
  exports: [EventBusService],
})
export class EventBusModule {}
