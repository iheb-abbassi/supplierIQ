import { Injectable } from '@nestjs/common';

/**
 * Event handler function type
 * Receives the event payload and processes it
 */
type EventHandler = (payload: any) => void;

/**
 * EventBusService
 *
 * A simple in-memory event bus for decoupled communication between modules.
 * Implements a basic pub/sub pattern where:
 * - Publishers emit events with a name and payload
 * - Subscribers register handlers for specific event names
 *
 * This service is registered as a singleton, ensuring all modules
 * share the same instance and can communicate through it.
 *
 * Usage:
 *   // Subscribe to an event
 *   eventBus.on('RequestCreated', (payload) => {
 *     console.log('New request:', payload.requestId);
 *   });
 *
 *   // Emit an event
 *   eventBus.emit('RequestCreated', { requestId: '123' });
 */
@Injectable()
export class EventBusService {
  /**
   * Map of event names to their registered handlers
   * Each event can have multiple handlers (subscribers)
   */
  private subscribers: Map<string, EventHandler[]> = new Map();

  /**
   * Register a handler for a specific event
   *
   * @param eventName - The name of the event to subscribe to
   * @param handler - The function to call when the event is emitted
   *
   * @example
   * eventBus.on('UserCreated', (user) => {
   *   sendWelcomeEmail(user.email);
   * });
   */
  on(eventName: string, handler: EventHandler): void {
    // Get existing handlers for this event, or initialize empty array
    const handlers = this.subscribers.get(eventName) || [];

    // Add the new handler to the list
    handlers.push(handler);

    // Update the map with the new handlers list
    this.subscribers.set(eventName, handlers);
  }

  /**
   * Emit an event to all registered handlers
   *
   * @param eventName - The name of the event to emit
   * @param payload - The data to pass to all handlers
   *
   * @example
   * eventBus.emit('UserCreated', { id: '123', email: 'user@example.com' });
   */
  emit(eventName: string, payload: any): void {
    // Get all handlers registered for this event
    const handlers = this.subscribers.get(eventName);

    // If no handlers are registered, nothing to do
    if (!handlers || handlers.length === 0) {
      return;
    }

    // Call each handler with the payload
    // Handlers are called synchronously in registration order
    for (const handler of handlers) {
      try {
        handler(payload);
      } catch (error) {
        // Log errors but don't let one handler's failure
        // prevent other handlers from being called
        console.error(
          `Error in event handler for "${eventName}":`,
          error,
        );
      }
    }
  }
}
