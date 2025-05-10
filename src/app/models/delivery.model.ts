  export interface Delivery {
    id: number;
    customer: string;
    address: string;
    status: 'delivered' | 'in-progress' | 'pending';
    time: Date;
    amount: string;
    courier: string;
  }
  export interface Deliveries {
    id: string;
    orderId: string;
    status: 'pending' | 'in_transit' | 'delivered' | 'failed' | 'returned';
    estimatedDelivery: string;
    actualDelivery?: string;
    customer: {
      name: string;
      address: string;
      phone: string;
    };
    deliveryAgent?: {
      id: string;
      name: string;
      phone: string;
      photo: string;
      rating: number;
    };
    items: number;
    location: {
      lat: number;
      lng: number;
    };
    notes?: string;
    signature?: string;
    trackingHistory: TrackingEvent[];
  }
  
  export interface TrackingEvent {
    timestamp: string;
    status: string;
    description: string;
    location?: string;
  }
  
  export interface Location {
    idLocation:number;
    name: string;
    percentage: number;
  }

  export interface DeliveryStats {
    delivered?: { count: number; percentage: number };
    'in-progress'?: { count: number; percentage: number };
    pending?: { count: number; percentage: number };
  }
  export interface StatsCard {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: string;
    iconBg: string;
  }