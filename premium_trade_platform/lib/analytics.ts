// Analytics and tracking utilities
interface TrackingEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface ViewEvent {
  page: string;
  builderModel?: string;
  builderEntry?: string;
  userId?: string;
}

export interface ClickEvent {
  element: string;
  location: string;
  builderModel?: string;
  builderEntry?: string;
  userId?: string;
}

export interface PurchaseEvent {
  productId: string;
  price: number;
  currency: string;
  userId?: string;
}

class AnalyticsService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendEvent(event: TrackingEvent) {
    // Send to multiple analytics services
    this.sendToVercel(event);
    this.sendToCustomAnalytics(event);
    
    // Also log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
    }
  }

  private sendToVercel(event: TrackingEvent) {
    // Vercel Analytics automatically tracks page views
    // Custom events can be sent via the analytics package
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', event.name, event.properties);
    }
  }

  private sendToCustomAnalytics(event: TrackingEvent) {
    // Send to custom endpoint for detailed tracking
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(error => {
        console.warn('Failed to send analytics event:', error);
      });
    }
  }

  public trackView(event: ViewEvent) {
    this.sendEvent({
      name: 'page_view',
      properties: {
        page: event.page,
        builderModel: event.builderModel,
        builderEntry: event.builderEntry,
        timestamp: new Date().toISOString(),
      },
      userId: event.userId,
    });
  }

  public trackClick(event: ClickEvent) {
    this.sendEvent({
      name: 'click',
      properties: {
        element: event.element,
        location: event.location,
        builderModel: event.builderModel,
        builderEntry: event.builderEntry,
        timestamp: new Date().toISOString(),
      },
      userId: event.userId,
    });
  }

  public trackPurchase(event: PurchaseEvent) {
    this.sendEvent({
      name: 'purchase',
      properties: {
        productId: event.productId,
        price: event.price,
        currency: event.currency,
        timestamp: new Date().toISOString(),
      },
      userId: event.userId,
    });
  }

  public trackCustomEvent(name: string, properties?: Record<string, any>, userId?: string) {
    this.sendEvent({
      name,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
      },
      userId,
    });
  }

  // Track Web Vitals for performance monitoring
  public trackWebVital(name: string, value: number, id: string, route: string) {
    this.sendEvent({
      name: 'web_vital',
      properties: {
        metric: name,
        value,
        id,
        route,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Convenience functions
export const trackView = (event: ViewEvent) => analytics.trackView(event);
export const trackClick = (event: ClickEvent) => analytics.trackClick(event);
export const trackPurchase = (event: PurchaseEvent) => analytics.trackPurchase(event);
export const trackCustomEvent = (name: string, properties?: Record<string, any>, userId?: string) => 
  analytics.trackCustomEvent(name, properties, userId);

// Hook for React components
export const useAnalytics = () => {
  return {
    trackView,
    trackClick,
    trackPurchase,
    trackCustomEvent,
  };
};
